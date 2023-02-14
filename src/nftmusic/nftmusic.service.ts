import { Body, ForbiddenException, Injectable, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicRepository } from "./repository/nftmusic.repository";
import { NftMusicGenreRepository } from "./repository/nftmusic_genre.repository";
import { NftMusicFileRepository } from "./repository/nftmusic_file.repository";
import { CreateNftDto } from "./dto/create.nft.dto";
import { UserNftMusicRepository } from "./repository/user_nftmusic.repository";
import { NftLikeDto } from "./dto/like.nft.dto";
import { NftMusicLikeRepository } from "./repository/nftmusic_like.repository";
import { InfoNftDto } from "./dto/info.nft.dto";
import { MyMusicService } from "../mymusic/mymusic.service";
import { UploadService } from "../upload/upload.service";
import { MetadataNftDto } from "./dto/metadata.nft.dto";
import { SortNftDto } from "./dto/sort.nft.dto";
import { ShowtimeService } from "../showtime/showtime.service";
import { GiftNftDto } from "./dto/gift.nft.dto";
import { NftHistoryDto } from "./dto/nfthistory.dto";
import { NftHistoryRepository } from "./repository/nfthistory.repository";
import { InfoNftHistoryDto } from "./dto/info.nfthistory.dto";
import {FindByUserNftDto} from "./dto/findbyuser.nft.dto";
import { NftProvenanceDto } from "./dto/nft.provenance.dto";
import { CreateL2eDto } from "./dto/create.l2e.dto";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { UserRepository } from "../user/repository/user.repository";
import { Rsa } from "../util/rsa";
import { GenreService } from "../genre/genre.service";
@Injectable()
export class NftMusicService {
  constructor(
    private nftMusicRepository: NftMusicRepository,
    private nftMusicGenreRepository: NftMusicGenreRepository,
    private nftMusicFileRepository: NftMusicFileRepository,
    private userNftMusicRepository: UserNftMusicRepository,
    private nftMusicLikeRepository: NftMusicLikeRepository,
    private nftHistoryRepository: NftHistoryRepository,
    private l2eRepository: L2eRepository,
    private myMusicService: MyMusicService,
    private uploadService: UploadService,
    private showtimeService: ShowtimeService,
    private userRepository: UserRepository,
    private genreService: GenreService,
  ) {}


  async createIpfs(userId: number, createNftDto: CreateNftDto): Promise<string> {
    try {
      const infoMusicDto = await this.myMusicService.findMusicInfo(createNftDto.myMusicId);

      const metadataNftDto = new MetadataNftDto();
      metadataNftDto.title = infoMusicDto.title;
      metadataNftDto.name = infoMusicDto.name;
      metadataNftDto.artist = infoMusicDto.artist;
      metadataNftDto.genres = infoMusicDto.genres;
      metadataNftDto.description = infoMusicDto.description;
      metadataNftDto.playTime = infoMusicDto.playTime;
      metadataNftDto.minter = createNftDto.minter;
      metadataNftDto.tokenId = createNftDto.tokenId;

      for(const i of infoMusicDto.files) {
        if(i.filetype == 'MUSIC') {
          metadataNftDto.musicIpfsHash = await this.uploadService.uploadFileToIpfs(i.fileId);
        } else {
          metadataNftDto.imageIpfsHash = await this.uploadService.uploadFileToIpfs(i.fileId);
        }
      }
      const ipfsHash = await this.uploadService.uploadMetadataToIpfs(metadataNftDto).then(async (ipfsHash: string) => {
        return ipfsHash;
      });

      return ipfsHash;
    } catch (e) {
      console.log(e);
      throw new RuntimeException();
    }
  }

  async createNft(userId: number, createNftDto: CreateNftDto): Promise<boolean> {
    try {
      const infoMusicDto = await this.myMusicService.findMusicInfo(createNftDto.myMusicId);

      await this.nftMusicRepository.createNft(createNftDto, await infoMusicDto).then(async (nftMusicId) => {
        await this.nftMusicGenreRepository.createNftMusicGenre(nftMusicId, await infoMusicDto);
        await this.nftMusicFileRepository.createNftMusicFile(nftMusicId, await infoMusicDto);
        await this.userNftMusicRepository.createUserNftMusic(userId, nftMusicId);
      });
      await this.myMusicService.deleteMusic(createNftDto.myMusicId);

      return true;
    } catch (e) {
      console.log(e);
      // throw new RuntimeException();
      return false;
    }
  }

  async findMyNftList(authToken: string): Promise<InfoNftDto[]> {

    const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    const showtimeList = await this.showtimeService.getHolderShowtimes(userInfo.id);
    const nftList = await this.nftMusicRepository.findMyNftList(userInfo.id);
    return showtimeList.concat(nftList);
  }

  async findNftList(sortNftDto: SortNftDto): Promise<InfoNftDto[]> {
    return await this.nftMusicRepository.findNftList(sortNftDto);
  }

  async findNftListByUser(findByUserNftDto: FindByUserNftDto): Promise<InfoNftDto[]> {
    return await this.nftMusicRepository.findNftListByUser(findByUserNftDto);
  }

  async findNftLikeList(sortNftDto: SortNftDto): Promise<InfoNftDto[]> {
    return await this.nftMusicRepository.findNftLikeList(sortNftDto);
  }

  async findNftInfo(source: string, nftMusicId: number, authToken: string): Promise<InfoNftDto> {

    let response: any = {};

    response.connectorInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    if(source == 'showtime') {
      response.myNftInfo = await this.showtimeService.getHolderShowtime(nftMusicId, response.connectorInfo.id);
    } else {
      response.myNftInfo = await this.nftMusicRepository.findNftInfo(nftMusicId, response.connectorInfo.id);
    }

    return response;
  }

  async createNftLike(nftLikeDto: NftLikeDto): Promise<boolean> {
    return await this.nftMusicLikeRepository.createNftLike(nftLikeDto);
  }

  async deleteNftLike(nftLikeDto: NftLikeDto): Promise<boolean> {
    return await this.nftMusicLikeRepository.deleteNftLike(nftLikeDto);
  }

  async patchPlayCount(nftMusicId: number) {
    await this.nftMusicRepository.patchPlayCount(nftMusicId);
  }

  async patchOnSale(nftMusicId: number, source: string, isOnSale: string) {
    if(source == 'showtime') {
      await this.showtimeService.patchOnSale(nftMusicId, isOnSale);
    } else {
      await this.nftMusicRepository.patchOnSale(nftMusicId, isOnSale);
    }
  }

  async replaceUserNft(userId: number, nftMusicId: number) {
    await this.userNftMusicRepository.deleteUserNftMusic(nftMusicId).then(async (result) => {
      await this.userNftMusicRepository.createUserNftMusic(userId, nftMusicId);
    });
  }

  async nftGift(userId: number, giftNftDto: GiftNftDto): Promise<boolean> {
    try {
      if(giftNftDto.source == 'showtime') {
        await this.showtimeService.replaceHolderShowtime(giftNftDto.toUserId, giftNftDto.nftMusicId);
      } else {
        await this.replaceUserNft(giftNftDto.toUserId, giftNftDto.nftMusicId);
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async saveHistory(nftHistoryDto: NftHistoryDto) {
    await this.nftHistoryRepository.saveHistory(nftHistoryDto);
  }

  async getNftHistoryInTokenId(tokenId: string): Promise<NftProvenanceDto[]> {
    return await this.nftHistoryRepository.getNftHistoryInTokenId(tokenId);
  }

  async getNftHistoryInAddress(address: string): Promise<InfoNftHistoryDto[]> {
    return await this.nftHistoryRepository.getNftHistoryInAddress(address);
  }

  async getNftHistoryDetail(id: number): Promise<InfoNftHistoryDto> {
    return await this.nftHistoryRepository.getNftHistoryDetail(id);
  }

  async createL2e(createL2eDto: CreateL2eDto) {
    await this.l2eRepository.saveL2e(createL2eDto);
  }

  async playList(authToken: string, sortNftDto: SortNftDto): Promise<any> {

    if(typeof sortNftDto.skip == 'undefined' || isNaN(sortNftDto.skip))
      sortNftDto.skip = 0;

    if(typeof sortNftDto.take == 'undefined' || isNaN(sortNftDto.take))
      sortNftDto.take = 10;

    let response: any = {};

    const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    if(userInfo.id == 0) {
      throw new ForbiddenException();
      return false;
    }

    response.connectorInfo = userInfo;
    response.genreList = await this.genreService.getGenreAll();

    switch (sortNftDto.query) {
      case 'newRelease':
        response.playList = await this.nftMusicRepository.findNftListTake(sortNftDto);
        break;
      case 'likes':
        sortNftDto.userId = userInfo.id;
        response.playList = await this.nftMusicRepository.findNftListTake(sortNftDto);
        break;
      case 'recentlyPlayed':
        const recentPlayed = [];
        sortNftDto.userId = userInfo.id;
        const played = await this.l2eRepository.getRecentPlayed(sortNftDto);
        for(const recent of played) {
          const info = await this.nftMusicRepository.findNftToTokenIdAndSource(recent.tokenId, recent.source, recent.totalSecond);
          recentPlayed.push(info);
        }
        response.playList = recentPlayed;
        break;
      case 'streamingTop':
        const streamingTop50 = [];
        const l2eTop50 = await this.l2eRepository.getStreamingTop(sortNftDto);
        for(const l2eInfo of l2eTop50) {
          const info = await this.nftMusicRepository.findNftToTokenIdAndSource(l2eInfo.tokenId, l2eInfo.source, l2eInfo.totalSecond);
          streamingTop50.push(info);
        }
        response.playList = streamingTop50;
        break;
      case 'myLikes':
        sortNftDto.userId = userInfo.id;
        response.playList = await this.nftMusicRepository.findNftListTake(sortNftDto);
        break;
      case 'showtime':
        response.playList = await this.showtimeService.getLandingRecents(sortNftDto);
        break;
    }

    // return await this.nftMusicRepository.findNftList(sortNftDto);
    return response;
  }
}
