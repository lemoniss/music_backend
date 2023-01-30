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

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private exchangeGenreRepository: ExchangeGenreRepository,
    private exchangeFileRepository: ExchangeFileRepository,
    private userExchangeRepository: UserExchangeRepository,
    private nftMusicService: NftMusicService,
    private showtimeService: ShowtimeService,
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

  async findExchangeList(searchExchangeDto: SearchExchangeDto): Promise<InfoExchangeDto[]> {
    return await this.exchangeRepository.findExchangeList(searchExchangeDto);
  }

  async findExchangeInfo(exchangeId: number, userId: number): Promise<InfoExchangeDto> {
    return await this.exchangeRepository.findExchangeInfo(exchangeId, userId);
  }

  async findExchangeInfoByTokenId(tokenId: number): Promise<InfoExchangeDto> {
    return await this.exchangeRepository.findExchangeInfoByTokenId(tokenId);
  }

  async purchase(userId: number, itemExchangeDto: ItemExchangeDto): Promise<boolean> {
    try {
      const exchangeInfo = await this.exchangeRepository.findExchangeInfo(itemExchangeDto.exchangeId, userId);

      await this.nftMusicService.patchOnSale(itemExchangeDto.nftMusicId, itemExchangeDto.source, 'N');
      if(itemExchangeDto.source == 'showtime') {
        await this.showtimeService.replaceHolderShowtime(userId, itemExchangeDto.nftMusicId);
      } else {
        await this.nftMusicService.replaceUserNft(userId, itemExchangeDto.nftMusicId);
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
