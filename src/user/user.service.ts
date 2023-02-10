import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from "./repository/user.repository";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { InfoUserDto } from "./dto/info.user.dto";
import { UserFileRepository } from "./repository/user_file.repository";
import { UserGenreRepository } from "./repository/user_genre.repository";
import { UserSnsRepository } from "./repository/user_sns.repository";
import { ResponseInfoUserDto } from "./dto/response.info.user.dto";
import { UserOtpRepository } from "./repository/user_otp.repository";
import { ResponseOtpUserDto } from "./dto/response.otp.user.dto";
import { ResponseCorpWalletDto } from "./dto/response.corp.wallet.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserOtpEntity } from "./entity/user_otp.entity";
import { UserFileEntity } from "./entity/user_file.entity";
import { UserGenreEntity } from "./entity/user_genre.entity";
import { UserSnsEntity } from "./entity/user_sns.entity";
import { Rsa } from "../util/rsa";
import { SortNftDto } from "../nftmusic/dto/sort.nft.dto";
import { ShowtimeRepository } from "../showtime/repository/showtime.repository";
import { ShowtimeHolderRepository } from "../showtime/repository/showtime_holder.repository";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";
const crypto = require("crypto");
const fs = require('fs');

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userFileRepository: UserFileRepository,
    private userGenreRepository: UserGenreRepository,
    private userSnsRepository: UserSnsRepository,
    private userOtpRepository: UserOtpRepository,
    private showtimeRepository: ShowtimeRepository,
    private showtimeHolderRepository: ShowtimeHolderRepository,
    private nftMusicRepository: NftMusicRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<InfoUserDto> {

    const userInfo = await this.userRepository.findByAddress(createUserDto.address);

    if(userInfo.id == 0) {
      while (true) {
        const handle = this.makeHandle();
        const result = await this.userRepository.isExistHandle(handle);
        if(result) {
          createUserDto.handle = handle;
          break;
        }
      }
      return await this.userRepository.createUser(createUserDto).then(async () => {
        return await this.userRepository.findByAddress(createUserDto.address);
      });
    } else {
      return userInfo;
    }
  }

  async updateUser(handle: string, updateUserDto: UpdateUserDto): Promise<boolean> {

    const handleInfo = await this.userRepository.findByHandle(handle);

    const userInfo = await this.findById(handleInfo.id);

    if(userInfo.handle != updateUserDto.handle) {
      if(await this.isExistHandle(updateUserDto.handle.replace('@', '')) == false) {
        return false;
      }
    }

    if(typeof updateUserDto.fileId != 'undefined') {
      await this.userFileRepository.createUserFile(handleInfo.id, updateUserDto);
    }

    if(typeof updateUserDto.userSnsModels != 'undefined' && updateUserDto.userSnsModels.length > 0) {
      await this.userSnsRepository.createUserSns(handleInfo.id, updateUserDto);
    }

    if(typeof updateUserDto.genreIds != 'undefined' && updateUserDto.genreIds.length > 0) {
      await this.userGenreRepository.createUserGenre(handleInfo.id, updateUserDto);
    }

    return await this.userRepository.updateUser(handleInfo.id, updateUserDto);
  }

  async findById(id: number) : Promise<InfoUserDto> {
    return await this.userRepository.findById(id);
  }

  async findByAddress(address: string) : Promise<InfoUserDto> {
    return await this.userRepository.findByAddress(address);
  }

  async findByHandle(handle: string) : Promise<InfoUserDto> {
    return await this.userRepository.findByHandle(handle);
  }

  async findMyInfo(authToken: string) : Promise<any> {
    const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    let response: any = {};

    const userId = userInfo.id;
    response.userInfo = await this.userRepository.findById(userId);
    response.followingInfo = {following: "N/A", follower: "N/A"};

    response.releases = await this.showtimeRepository.getRecentByArtist(userId);
    response.fellaz = await this.showtimeRepository.getFellazByArtist(userId, 0);

    const showtimeList = await this.showtimeHolderRepository.getLandingHolderShowtimes(userId);
    const nftList = await this.nftMusicRepository.getLandingMyNftList(userId); //TODO: playCount 수정
    response.collection = showtimeList.concat(nftList);

    return response;
    // return await this.userRepository.findMyInfo(userInfo.id);
  }


  async findByIdAndAddress(id: number, address: string) : Promise<UserEntity> {
    return await this.userRepository.findByIdAndAddress(id, address);
  }

  async isExistHandle(handle: string) : Promise<boolean> {
    return await this.userRepository.isExistHandle(handle);
  }

  async getUserTokenInfo(authToken: string) : Promise<ResponseInfoUserDto> {
    const privateKey = fs.readFileSync('./private_key.pem', {encoding: 'utf-8'});
    const decryptToken = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        oaepLabel: 'millim-x',
      }, Buffer.from(authToken, 'base64')
    );
    const decryptTokenStr = Buffer.from(decryptToken.buffer).toString();
    const map = new Map(Object.entries(JSON.parse(decryptTokenStr)));

    const responseInfoUserDto = new ResponseInfoUserDto();
    responseInfoUserDto.userId = Number(map.get('userId'));
    responseInfoUserDto.address = map.get('address').toString();
    // responseInfoUserDto.pk = map.get('pk').toString();

    return responseInfoUserDto;
  }

  async checkOtp(authToken: string) : Promise<ResponseOtpUserDto> {

    const userTokenInfo = await this.getUserTokenInfo(authToken);
    const responseOtpUserDto = await this.userOtpRepository.findByUserId(userTokenInfo.userId);

    if(Object.keys(responseOtpUserDto).length === 0) {
      const speakeasy = require('speakeasy');
      const secret = speakeasy.generateSecret({
        length: 10,
        name : 'Millim:x',
        algorithm: 'sha512'
      });
      await this.userOtpRepository.createUserOtp(userTokenInfo.userId, secret.base32);
      responseOtpUserDto.userId = userTokenInfo.userId;
      responseOtpUserDto.secret = secret.base32;
      responseOtpUserDto.isFirst = true;
    }
    return responseOtpUserDto;
  }

  async verifyOtp(authToken: string, code: string) : Promise<boolean> {

    const userTokenInfo = await this.getUserTokenInfo(authToken);
    const responseOtpUserDto = await this.userOtpRepository.findByUserId(userTokenInfo.userId);

    const speakeasy = require('speakeasy');

    // const token = speakeasy.totp({
    //   secret: responseOtpUserDto.secret,
    //   encoding: 'base32',
    // });

    return speakeasy.totp.verify({
      secret: responseOtpUserDto.secret,
      encoding: 'base32',
      token: code,
      window: 6
    });
  }

  async getCorpWalletInfo() : Promise<ResponseCorpWalletDto> {

    try {
      // const userTokenInfo = await this.getUserTokenInfo(authToken);

      const responseCorpWalletDto = new ResponseCorpWalletDto();
      responseCorpWalletDto.address = process.env.CORP_WALLET_ADDRESS;
      responseCorpWalletDto.pk = process.env.CORP_WALLET_PK;
      return responseCorpWalletDto;
    } catch (e) {
      throw new RuntimeException('createShowtimeIpfs Server Error. Please try again later.');
      // return false;
    }
  }

  makeHandle() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}
