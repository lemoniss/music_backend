import { Get, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeRepository } from "./repository/showtime.repository";
import { CreateShowTimeDto } from "./dto/create.showtime.dto";
import { UploadService } from "../upload/upload.service";
import { GenreService } from "../genre/genre.service";
import { IpfsShowtimeDto } from "./dto/ipfs.showtime.dto";
import { ResponseShowtimeIpfsDto } from "./dto/response.showtimeipfs.dto";
import { ShowtimeGenreRepository } from "./repository/showtime_genre.repository";
import { ShowtimeDistributorRepository } from "./repository/showtime_distributor.repository";
import { UserShowtimeRepository } from "./repository/user_showtime.repository";
import { CreateShowTimeDataDto } from "./dto/create.showtimedata.dto";
import { ShowtimeTierRepository } from "./repository/showtime_tier.repository";
import { ShowtimeFileRepository } from "./repository/showtime_file.repository";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { PurchaseShowtimeDto } from "./dto/purchase.showtime.dto";
import { ShowtimePurchasehistoryRepository } from "./repository/showtime_purchasehistory.repository";
import { ShowtimeCrewRepository } from "./repository/showtime_crew.repository";
import { CreateShowTimeLikeDto } from "./dto/create.showtimelike.dto";
import { ShowtimeLikeRepository } from "./repository/showtime_like.repository";
import { ResponseUpcomingDto } from "./dto/response.upcoming.dto";
import { ResponseRecentListDto } from "./dto/response.recentlist.dto";
import { ResponseRecentDto } from "./dto/response.recent.dto";
import { CreateUserFollowerDto } from "./dto/create.userfollower.dto";
import { UserFollowerRepository } from "./repository/user_follower.repository";
import { UserRepository } from "./repository/user.repository";
import { ResponseArtistDto } from "./dto/response.artist.dto";
import { ResponseTierListDto } from "./dto/response.tierlist.dto";
import { UpcomingToRecentRepository } from "./repository/upcoming_to_recent.repository";
import { UpcomingToRecentFileRepository } from "./repository/upcoming_to_recent_file.repository";
import { UpcomingToRecentGenreRepository } from "./repository/upcoming_to_recent_genre.repository";
import { ShowtimeHolderRepository } from "./repository/showtime_holder.repository";
import { InfoNftDto } from "../nftmusic/dto/info.nft.dto";
import { NftHistoryRepository } from "../nftmusic/repository/nfthistory.repository";
import { CoinMarketRateRepository } from "./repository/coin_marketrate.repository";
import { CoinMarketRateDto } from "./dto/create.coinmarketrate.dto";
import { EtherscanGastrackerDto } from "./dto/create.etherscangastracker.dto";
import { EtherscanGastrackerRepository } from "./repository/etherscan_gastracker.repository";
import { ResponseRecentIosWebDto } from "./dto/response.recent.iosweb.dto";
import { BannerRepository } from "./repository/banner.repository";
import { CreateBannerDataDto } from "./dto/create.bannerdata.dto";
import { BannerFileRepository } from "./repository/banner_file.repository";
import { ResponseBannerDataDto } from "./dto/response.bannerdata.dto";
import { CreateBannerLikeDto } from "./dto/create.bannerlike.dto";
import { BannerLikeRepository } from "./repository/banner_like.repository";
import { ApiOperation } from "@nestjs/swagger";
import axios from "axios";
import fs from "fs";
import { BannerLikeEntity } from "./entity/banner_like.entity";
import { BannerFileEntity } from "./entity/banner_file.entity";
import { ShowtimeEntity } from "./entity/showtime.entity";
import { ShowtimeGenreEntity } from "./entity/showtime_genre.entity";
import { ShowtimeDistributorEntity } from "./entity/showtime_distributor.entity";
import { UserShowtimeEntity } from "./entity/user_showtime.entity";
import { ShowtimeTierEntity } from "./entity/showtime_tier.entity";
import { ShowtimeFileEntity } from "./entity/showtime_file.entity";
import { ShowtimePurchaseHistoryEntity } from "./entity/showtime_purchasehistory.entity";
import { ShowtimeCrewEntity } from "./entity/showtime_crew.entity";
import { ShowtimeLikeEntity } from "./entity/showtime_like.entity";
import { UserFollowerEntity } from "./entity/user_follower.entity";
import { UserEntity } from "./entity/user.entity";
import { ShowtimeHolderEntity } from "./entity/showtime_holder.entity";
import { NftMusicEntity } from "./entity/nftmusic.entity";
import { NftMusicFileEntity } from "./entity/nftmusic_file.entity";
import { NftMusicGenreEntity } from "./entity/nftmusic_genre.entity";
import { NftHistoryEntity } from "../nftmusic/entity/nfthistory.entity";
import { CoinMarketRateEntity } from "./entity/coin_marketrate.entity";
import { EtherscanGastrackerEntity } from "./entity/etherscan_gastracker.entity";
import { BannerEntity } from "./entity/banner.entity";

@Injectable()
export class ShowtimeService {
  constructor(
    private showtimeRepository: ShowtimeRepository,
    private showtimeGenreRepository: ShowtimeGenreRepository,
    private showtimeDistributorRepository: ShowtimeDistributorRepository,
    private userShowtimeRepository: UserShowtimeRepository,
    private showtimeTierRepository: ShowtimeTierRepository,
    private showtimeFileRepository: ShowtimeFileRepository,
    private showtimePurchasehistoryRepository: ShowtimePurchasehistoryRepository,
    private showtimeCrewRepository: ShowtimeCrewRepository,
    private showtimeLikeRepository: ShowtimeLikeRepository,
    private userFollowerRepository: UserFollowerRepository,
    private userRepository: UserRepository,
    private showtimeHolderRepository: ShowtimeHolderRepository,
    private upcomingToRecentRepository: UpcomingToRecentRepository,
    private upcomingToRecentFileRepository: UpcomingToRecentFileRepository,
    private upcomingToRecentGenreRepository: UpcomingToRecentGenreRepository,
    private nftHistoryRepository: NftHistoryRepository,
    private coinMarketRateRepository: CoinMarketRateRepository,
    private etherscanGastrackerRepository: EtherscanGastrackerRepository,
    private bannerRepository: BannerRepository,
    private bannerFileRepository: BannerFileRepository,
    private bannerLikeRepository: BannerLikeRepository,
    private uploadService: UploadService,
  ) {}

  async createShowtimeIpfs(showTimeId: number, createShowTimeDto: CreateShowTimeDataDto): Promise<string> {

    /**
     * 0. genreId를 가지고 이름을 구해온다.
     */
    // createShowTimeDto.genres = '';
    // if(typeof createShowTimeDto.genreIds != 'undefined') {
    //   for(const genreId of createShowTimeDto.genreIds) {
    //     const genreInfo = await this.genreService.getGenreInfo(genreId);
    //     createShowTimeDto.genres += genreInfo.name + ', ';
    //   }
    //
    //   createShowTimeDto.genres = createShowTimeDto.genres.substring(0, createShowTimeDto.genres.length-2);
    // }

    /**
     * 1. 파일 각각의 ipfsHash를 구한다.
     */
    const musicFileIpshHash = await this.uploadService.uploadFileToIpfs(createShowTimeDto.musicFileId);

    const ipfsShowtimeDtos = [];

    const startTokenId = Number(createShowTimeDto.startTokenId);
    const lastTokenId = createShowTimeDto.lastTokenId;
    let currentTokenId = 0;

    if(typeof createShowTimeDto.goldCount != 'undefined') {
      currentTokenId = startTokenId;
      const imageIpshHash = await this.uploadService.uploadFileToIpfs(createShowTimeDto.goldImageFileId);

      for(let i=1; i<= createShowTimeDto.goldCount; i++) {
        /**
         * gold
         */
        const ipfsShowtimeDto = new IpfsShowtimeDto();
        ipfsShowtimeDto.name = createShowTimeDto.name + ' #' + i;
        ipfsShowtimeDto.artist = createShowTimeDto.artist;
        ipfsShowtimeDto.title = createShowTimeDto.title;
        // ipfsShowtimeDto.genres = createShowTimeDto.genres;
        ipfsShowtimeDto.description = createShowTimeDto.description;
        ipfsShowtimeDto.musicIpfsHash = musicFileIpshHash;
        ipfsShowtimeDto.playTime = createShowTimeDto.playTime;
        ipfsShowtimeDto.tier = 'Gold'
        ipfsShowtimeDto.no = i;
        ipfsShowtimeDto.imageIpfsHash = imageIpshHash;
        ipfsShowtimeDto.royaltyPercent = 750; // 7.5%
        ipfsShowtimeDto.royaltyAddress = createShowTimeDto.distributors[0].distributorAddress;
        ipfsShowtimeDto.tokenId = currentTokenId.toString();

        createShowTimeDto.no = i;

        if(typeof createShowTimeDto.goldRares != 'undefined') {
          for(const goldRare of createShowTimeDto.goldRares) {
            if(goldRare.no == i) {   // 레어에 당첨되었다?
              ipfsShowtimeDto.rareImageIpfsHash = [];
              for(let j= 0; j< goldRare.imageFileIds.length; j++) {
                ipfsShowtimeDto.rareImageIpfsHash.push(await this.uploadService.uploadFileToIpfs(goldRare.imageFileIds[j]));
              }
            }
          }
        }

        ipfsShowtimeDtos.push(ipfsShowtimeDto);

        const tierDataDto = new CreateShowTimeDataDto();
        tierDataDto.tier = 'Gold';
        tierDataDto.description = createShowTimeDto.goldDescription;
        tierDataDto.name = createShowTimeDto.name + ' #' + i;
        tierDataDto.no = i;
        tierDataDto.ipfsHash = '' + currentTokenId;
        tierDataDto.price = Number(createShowTimeDto.goldPrice);
        tierDataDto.tokenId = currentTokenId.toString();

        currentTokenId++;

        await this.showtimeTierRepository.createShowtimeTier(showTimeId, tierDataDto).then(async (showtimeTierId) => {

          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.musicFileId, 'MUSIC');
          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.goldImageFileId, 'IMAGE');

          if(typeof createShowTimeDto.rares != 'undefined') {
            for(const infoRareDto of createShowTimeDto.rares) {
              if(infoRareDto.no == createShowTimeDto.no) {
                for (const imageFileId of infoRareDto.imageFileIds) {
                  await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, imageFileId, 'RARE');
                }
              }
            }
          }
        });
      }
    }

    if(typeof createShowTimeDto.platinumCount != 'undefined') {
      if(currentTokenId == 0) currentTokenId = startTokenId;
      const imageIpshHash = await this.uploadService.uploadFileToIpfs(createShowTimeDto.platinumImageFileId);

      for(let i=1; i<= createShowTimeDto.platinumCount; i++) {
        /**
         * Platinum
         */
        const ipfsShowtimeDto = new IpfsShowtimeDto();
        ipfsShowtimeDto.name = createShowTimeDto.name + ' #' + i;
        ipfsShowtimeDto.artist = createShowTimeDto.artist;
        ipfsShowtimeDto.title = createShowTimeDto.title;
        // ipfsShowtimeDto.genres = createShowTimeDto.genres;
        ipfsShowtimeDto.description = createShowTimeDto.description;
        ipfsShowtimeDto.musicIpfsHash = musicFileIpshHash;
        ipfsShowtimeDto.playTime = createShowTimeDto.playTime;
        ipfsShowtimeDto.tier = 'Platinum'
        ipfsShowtimeDto.no = i;
        ipfsShowtimeDto.imageIpfsHash = imageIpshHash;
        ipfsShowtimeDto.royaltyPercent = 750; // 7.5%
        ipfsShowtimeDto.royaltyAddress = createShowTimeDto.distributors[0].distributorAddress;
        ipfsShowtimeDto.tokenId = currentTokenId.toString();

        createShowTimeDto.no = i;

        if(typeof createShowTimeDto.platinumRares != 'undefined') {
          for(const platinumRare of createShowTimeDto.platinumRares) {
            if(platinumRare.no == i) {   // 레어에 당첨되었다?
              ipfsShowtimeDto.rareImageIpfsHash = [];
              for(let j= 0; j< platinumRare.imageFileIds.length; j++) {
                ipfsShowtimeDto.rareImageIpfsHash.push(await this.uploadService.uploadFileToIpfs(platinumRare.imageFileIds[j]));
              }
            }
          }
        }

        ipfsShowtimeDtos.push(ipfsShowtimeDto);

        const tierDataDto = new CreateShowTimeDataDto();
        tierDataDto.tier = 'Platinum';
        tierDataDto.description = createShowTimeDto.platinumDescription;
        tierDataDto.name = createShowTimeDto.name + ' #' + i;
        tierDataDto.no = i;
        tierDataDto.ipfsHash = '' + currentTokenId;
        tierDataDto.price = Number(createShowTimeDto.platinumPrice);
        tierDataDto.tokenId = currentTokenId.toString();

        currentTokenId++;

        await this.showtimeTierRepository.createShowtimeTier(showTimeId, tierDataDto).then(async (showtimeTierId) => {

          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.musicFileId, 'MUSIC');
          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.platinumImageFileId, 'IMAGE');

          if(typeof createShowTimeDto.rares != 'undefined') {
            for(const infoRareDto of createShowTimeDto.rares) {
              if(infoRareDto.no == createShowTimeDto.no) {
                for (const imageFileId of infoRareDto.imageFileIds) {
                  await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, imageFileId, 'RARE');
                }
              }
            }
          }
        });
      }
    }

    if(typeof createShowTimeDto.diamondCount != 'undefined') {
      if(currentTokenId == 0) currentTokenId = startTokenId;
      const imageIpshHash = await this.uploadService.uploadFileToIpfs(createShowTimeDto.diamondImageFileId);

      for(let i=1; i<= createShowTimeDto.diamondCount; i++) {
        /**
         * Diamond
         */
        const ipfsShowtimeDto = new IpfsShowtimeDto();
        ipfsShowtimeDto.name = createShowTimeDto.name + ' #' + i;
        ipfsShowtimeDto.artist = createShowTimeDto.artist;
        ipfsShowtimeDto.title = createShowTimeDto.title;
        // ipfsShowtimeDto.genres = createShowTimeDto.genres;
        ipfsShowtimeDto.description = createShowTimeDto.description;
        ipfsShowtimeDto.musicIpfsHash = musicFileIpshHash;
        ipfsShowtimeDto.playTime = createShowTimeDto.playTime;
        ipfsShowtimeDto.tier = 'Diamond'
        ipfsShowtimeDto.no = i;
        ipfsShowtimeDto.imageIpfsHash = imageIpshHash;
        ipfsShowtimeDto.royaltyPercent = 750; // 7.5%
        ipfsShowtimeDto.royaltyAddress = createShowTimeDto.distributors[0].distributorAddress;
        ipfsShowtimeDto.tokenId = currentTokenId.toString();

        createShowTimeDto.no = i;

        if(typeof createShowTimeDto.diamondRares != 'undefined') {
          for(const diamondRare of createShowTimeDto.diamondRares) {
            if(diamondRare.no == i) {   // 레어에 당첨되었다?
              ipfsShowtimeDto.rareImageIpfsHash = [];
              for(let j= 0; j< diamondRare.imageFileIds.length; j++) {
                ipfsShowtimeDto.rareImageIpfsHash.push(await this.uploadService.uploadFileToIpfs(diamondRare.imageFileIds[j]));
              }
            }
          }
        }

        ipfsShowtimeDtos.push(ipfsShowtimeDto);

        const tierDataDto = new CreateShowTimeDataDto();
        tierDataDto.tier = 'Diamond';
        tierDataDto.description = createShowTimeDto.diamondDescription;
        tierDataDto.name = createShowTimeDto.name + ' #' + i;
        tierDataDto.no = i;
        tierDataDto.ipfsHash = '' + currentTokenId;
        tierDataDto.price = Number(createShowTimeDto.diamondPrice);
        tierDataDto.tokenId = currentTokenId.toString();

        currentTokenId++;

        await this.showtimeTierRepository.createShowtimeTier(showTimeId, tierDataDto).then(async (showtimeTierId) => {

          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.musicFileId, 'MUSIC');
          await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, createShowTimeDto.diamondImageFileId, 'IMAGE');

          if(typeof createShowTimeDto.rares != 'undefined') {
            for(const infoRareDto of createShowTimeDto.rares) {
              if(infoRareDto.no == createShowTimeDto.no) {
                for (const imageFileId of infoRareDto.imageFileIds) {
                  await this.showtimeFileRepository.createShowtimeFile(showtimeTierId, imageFileId, 'RARE');
                }
              }
            }
          }
        });
      }
    }
    try {
      return await this.uploadService.uploadShowtimeMetadataToIpfs(ipfsShowtimeDtos, lastTokenId);
    } catch (e) {
      throw new RuntimeException('createShowtimeIpfs Server Error. Please try again later.');
      // return false;
    }
  }

  async createShowtimeData(createShowTimeDataDto: CreateShowTimeDataDto): Promise<string> {

    try {
      const showtimeId = await this.showtimeRepository.createShowtime(createShowTimeDataDto);

      await this.showtimeGenreRepository.createShowtimeGenre(showtimeId, createShowTimeDataDto);
      await this.showtimeDistributorRepository.createShowtimeDistributor(showtimeId, createShowTimeDataDto);
      await this.userShowtimeRepository.createUserShowtime(1, showtimeId);
      await this.showtimeCrewRepository.createShowtimeCrew(showtimeId);

      return this.createShowtimeIpfs(showtimeId, createShowTimeDataDto);
    } catch (e) {
      throw new RuntimeException('createShowtimeData Server Error. Please try again later.');
      // return false;
    }
  }

  async createShowtimePurchase(purchaseShowtimeDto: PurchaseShowtimeDto): Promise<boolean> {
    try {

      await this.showtimeTierRepository.showtimeTierPurchaseStatusUpdate(purchaseShowtimeDto.showTimeTierId);
      await this.showtimeHolderRepository.createShowtimeHolder(purchaseShowtimeDto);
      await this.showtimePurchasehistoryRepository.createShowtimePurchasehistory(purchaseShowtimeDto);  // 구매내역 (로그성 데이터)

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async patchLike(createShowTimeLikeDto: CreateShowTimeLikeDto) {
    try {
      await this.showtimeLikeRepository.patchLike(createShowTimeLikeDto);
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async patchFollower(createUserFollowerDto: CreateUserFollowerDto) {
    try {
      await this.userFollowerRepository.patchFollower(createUserFollowerDto);
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async patchOnSale(tierId: number, isOnSale: string) {
    await this.showtimeHolderRepository.patchOnSale(tierId, isOnSale);
  }

  async getLastShowTimeId(): Promise<number> {
    return await this.showtimeRepository.getLastShowTimeId();
  }

  async getUpcoming(showtimeId: number, userId: number): Promise<ResponseUpcomingDto> {
    return await this.showtimeRepository.getUpcoming(showtimeId, userId);
  }

  async getAllShowtimes(): Promise<ResponseRecentListDto[]> {
    return await this.showtimeRepository.getAllShowtimes();
  }

  // async getRecents(): Promise<ResponseRecentListDto[]> {
  //   return await this.showtimeRepository.getRecents();
  // }

  async getRecent(showtimeId: number, userId: number): Promise<ResponseRecentDto> {
    return await this.showtimeRepository.getRecent(showtimeId, userId);
  }

  // async getRecentForIosWeb(showtimeId: number, userId: number): Promise<ResponseRecentIosWebDto> {
  //   return await this.showtimeRepository.getRecentForIosWeb(showtimeId, userId);
  // }

  async getTiers(tier:string, showtimeId: number): Promise<ResponseTierListDto[]> {
    return await this.showtimeTierRepository.getTiers(tier, showtimeId);
  }

  async getArtist(artistId: number, userId: number): Promise<ResponseArtistDto> {
    return await this.userRepository.getArtist(artistId, userId);
  }

  async getHolderShowtimes(userId: number): Promise<InfoNftDto[]> {
    return await this.showtimeHolderRepository.getHolderShowtimes(userId);
  }

  async getHolderShowtime(tierId: number, userId: number): Promise<InfoNftDto> {
    return await this.showtimeHolderRepository.getHolderShowtime(tierId, userId);
  }

  async replaceHolderShowtime(userId: number, tierId: number) {
    await this.showtimeHolderRepository.deleteHolderShowtime(tierId).then(async () => {
      const purchaseShowtimeDto = new PurchaseShowtimeDto();
      purchaseShowtimeDto.userId = userId;
      purchaseShowtimeDto.showTimeTierId = tierId;
      await this.showtimeHolderRepository.createShowtimeHolder(purchaseShowtimeDto);
    });
  }

  async getServertime(): Promise<String> {
    return await this.showtimeRepository.getServertime();
  }

  async getCoinCurrency(): Promise<CoinMarketRateDto[]> {
    return await this.coinMarketRateRepository.getCoinCurrency();
  }

  async getTargetCoinCurrency(target: string): Promise<string> {
    return await this.coinMarketRateRepository.getTargetCoinCurrency(target);
  }

  async getGasTracker(): Promise<EtherscanGastrackerDto> {
    return await this.etherscanGastrackerRepository.getGasTracker();
  }

  async createBanner(createBannerDataDto: CreateBannerDataDto): Promise<boolean> {

    try {

      const bannerId = await this.bannerRepository.createBanner(createBannerDataDto);

      if(typeof createBannerDataDto.fileId != 'undefined' && createBannerDataDto.fileId != 0) {
        await this.bannerFileRepository.createBannerFile(bannerId, createBannerDataDto);
      }
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. (createBanner) Please try again later.');
      return false;
    }
  }

  async getBanners(lang: string): Promise<ResponseBannerDataDto[]> {
    return await this.bannerRepository.getBanners(lang);
  }

  async getBanner(bannerId: number, userId: number): Promise<ResponseBannerDataDto> {
    return await this.bannerRepository.getBanner(bannerId, userId);
  }

  async updateBanner(bannerId: number, createBannerDataDto: CreateBannerDataDto): Promise<boolean> {

    try {
      await this.bannerRepository.updateBanner(bannerId, createBannerDataDto);
      if(typeof createBannerDataDto.fileId != 'undefined' && createBannerDataDto.fileId != 0) {
        await this.bannerFileRepository.createBannerFile(bannerId, createBannerDataDto);
      }
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. (updateBanner) Please try again later.');
      return false;
    }
  }

  async bannerPatchLike(createBannerLikeDto: CreateBannerLikeDto) {
    try {
      await this.bannerLikeRepository.patchLike(createBannerLikeDto);
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async metadataForceUpdate() {
    try {
      const showtimeList = await this.showtimeRepository.getAllShowtimes();

      for(const showtimeObj of showtimeList) {

        const tierInfo = await this.showtimeTierRepository.getTiersTokenId(showtimeObj.showtimeId);

        /**
         * TODO : opensea api key가 있어야 한댜. (testnet은 key가 없어도 동작됨)
         *  opensea api key를 발급 받으면 마저 작업하도록 한다.
         */

        // await axios.get(
        //   // 'https://millimx.infura-ipfs.io/ipfs/'+baseUriInfo.uri+'/' + i
        // 'https://testnets-api.opensea.io/api/v1/asset/0x4243059e3d7591c371b3336b752fe4dd8072f938/20/?force_update=true'
        // );
      }

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }
}
