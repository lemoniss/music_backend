import { Injectable, } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRepository } from "./repository/exchange.repository";
import { CreateExchangeDto } from "./dto/create.exchange.dto";
import { InfoExchangeDto } from "./dto/info.exchange.dto";
import { NftMusicService } from "../nftmusic/nftmusic.service";
import { ExchangeGenreRepository } from "./repository/exchange_genre.repository";
import { ExchangeFileRepository } from "./repository/exchange_file.repository";
import { UserExchangeRepository } from "./repository/user_exchange.repository";
import { SearchExchangeDto } from "./dto/search.exchange.dto";
import { ItemExchangeDto } from "./dto/item.exchange.dto";
import { ShowtimeService } from "../showtime/showtime.service";
import { Rsa } from "../util/rsa";
import { GenreService } from "../genre/genre.service";
import { UserRepository } from "../user/repository/user.repository";

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private exchangeGenreRepository: ExchangeGenreRepository,
    private exchangeFileRepository: ExchangeFileRepository,
    private userExchangeRepository: UserExchangeRepository,
    private userRepository: UserRepository,
    private nftMusicService: NftMusicService,
    private showtimeService: ShowtimeService,
    private genreService: GenreService,
  ) {}

  async registerExchangeItem(userId: number, createExchangeDto: CreateExchangeDto): Promise<boolean> {
    try {
      const infoNftMusicDto = await this.nftMusicService.findNftInfo(createExchangeDto.source, createExchangeDto.nftMusicId, userId);

      await this.exchangeRepository.registerExchangeItem(createExchangeDto, infoNftMusicDto).then(async (exchangeId) => {
          await this.exchangeGenreRepository.registerExchangeGenre(exchangeId, infoNftMusicDto);
          await this.exchangeFileRepository.registerExchangeFile(exchangeId, infoNftMusicDto);
          await this.userExchangeRepository.registerUserExchange(userId, exchangeId);
      });

      // const nftHistoryDto = new NftHistoryDto();
      // nftHistoryDto.userId = userId;
      // nftHistoryDto.nftMusicId = createExchangeDto.nftMusicId;
      // nftHistoryDto.price = createExchangeDto.price;
      // nftHistoryDto.classification = 'regist';
      // await this.nftMusicService.nftHistory(nftHistoryDto);

      return true;
    } catch (e) {
      console.log(e);
      // throw new RuntimeException();
      return false;
    }
  }

  async findExchangeList(searchExchangeDto: SearchExchangeDto): Promise<any> {

    let response: any = {};

    if(typeof searchExchangeDto.authToken != 'undefined') {
      response.myAddress = Rsa.decryptAddress(searchExchangeDto.authToken);
    }
    const exchangeList = await this.exchangeRepository.findExchangeList(searchExchangeDto);

    response.exchangeList = exchangeList;
    response.genreList = await this.genreService.getGenreAll();

    return response;
  }

  async findExchangeInfo(exchangeId: number, authToken: string): Promise<any> {

    let response: any = {};

    if(typeof authToken != 'undefined') {
      response.myAddress = Rsa.decryptAddress(authToken);
    }

    response.exchangeInfo = await this.exchangeRepository.findExchangeInfo(exchangeId, response.myAddress);

    return response;
  }

  async findExchangeInfoByTokenId(tokenId: number): Promise<InfoExchangeDto> {
    return await this.exchangeRepository.findExchangeInfoByTokenId(tokenId);
  }

  async purchase(authToken: string, itemExchangeDto: ItemExchangeDto): Promise<boolean> {
    try {

      const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

      // const exchangeInfo = await this.exchangeRepository.findExchangeInfo(itemExchangeDto.exchangeId, userId);

      await this.nftMusicService.patchOnSale(itemExchangeDto.nftMusicId, itemExchangeDto.source, 'N');
      if(itemExchangeDto.source == 'showtime') {
        await this.showtimeService.replaceHolderShowtime(userInfo.id, itemExchangeDto.nftMusicId);
      } else {
        await this.nftMusicService.replaceUserNft(userInfo.id, itemExchangeDto.nftMusicId);
      }
      await this.exchangeFileRepository.deleteExchangeFile(itemExchangeDto.exchangeId).then(async () => {
        await this.exchangeGenreRepository.deleteExchangeGenre(itemExchangeDto.exchangeId).then(async () => {
          await this.userExchangeRepository.deleteUserExchange(itemExchangeDto.exchangeId).then(async () => {
            await this.exchangeRepository.deleteExchange(itemExchangeDto.exchangeId);
            return true;
          });
        });
      });
    } catch (e) {
      console.log(e);
      // throw new RuntimeException();
      return false;
    }
  }

  async remove(exchangeId: number): Promise<boolean> {
    try {
      await this.exchangeFileRepository.deleteExchangeFile(exchangeId).then(async () => {
        await this.exchangeGenreRepository.deleteExchangeGenre(exchangeId).then(async () => {
          await this.userExchangeRepository.deleteUserExchange(exchangeId).then(async () => {
            await this.exchangeRepository.deleteExchange(exchangeId);
            return true;
          });
        });
      });
    } catch (e) {
      console.log(e);
      // throw new RuntimeException();
      return false;
    }
  }

  async cancel(userId: number, itemExchangeDto: ItemExchangeDto): Promise<boolean> {
    try {
      await this.nftMusicService.patchOnSale(itemExchangeDto.nftMusicId, itemExchangeDto.source, 'N');
      await this.exchangeFileRepository.deleteExchangeFile(itemExchangeDto.exchangeId).then(async () => {
        await this.exchangeGenreRepository.deleteExchangeGenre(itemExchangeDto.exchangeId).then(async () => {
          await this.userExchangeRepository.deleteUserExchange(itemExchangeDto.exchangeId).then(async () => {
            await this.exchangeRepository.deleteExchange(itemExchangeDto.exchangeId);
            return true;
          });
        });
      });
      // const nftHistoryDto = new NftHistoryDto();
      // nftHistoryDto.userId = userId;
      // nftHistoryDto.nftMusicId = itemExchangeDto.nftMusicId;
      // nftHistoryDto.price = 'NA';
      // nftHistoryDto.classification = 'cancel';
      // await this.nftMusicService.nftHistory(nftHistoryDto);
    } catch (e) {
      console.log(e);
      // throw new RuntimeException();
      return false;
    }
  }

}
