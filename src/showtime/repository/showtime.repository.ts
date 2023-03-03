import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateShowTimeDataDto } from "../dto/create.showtimedata.dto";
import { ResponseUpcomingDto } from "../dto/response.upcoming.dto";
import { ResponseRecentListDto } from "../dto/response.recentlist.dto";
import { ResponseRecentDto } from "../dto/response.recent.dto";
import { ResponsePurchasehistoryDto } from "../dto/response.purchasehistory.dto";
import { ResponseMembershipDto } from "../dto/response.membership.dto";
import { ResponseReleaseAtDto } from "../dto/response.releaseat.dto";
import { InfoUpcomingDto } from "../dto/info.upcoming.dto";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { ResponseIdHandleDto } from "../dto/response.idhandle.dto";
import { ResponseRecentIosWebDto } from "../dto/response.recent.iosweb.dto";
import { NftMusicLikeEntity } from "../../nftmusic/entity/nftmusic_like.entity";
import { ResponseCoversDto } from "../dto/response.covers.dto";
import { ResponseRecentWebDto } from "../dto/response.recent_web.dto";
import { ResponseUserInfoDto } from "../dto/response.userinfo.dto";
import { ResponseSongInfoDto } from "../dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../dto/response.nftinfo.dto";
import { ResponseContractInfoDto } from "../dto/response.contractinfo.dto";
import { ResponseSplitStructureDto } from "../dto/response.splitstructure.dto";
import {ResponseArtistDetailDto} from "../../landing/dto/response.artistrelease.dto";
import { BannerEntity } from "../entity/banner.entity";
import { Formatter } from "../../util/formatter";
import { SortNftDto } from "../../nftmusic/dto/sort.nft.dto";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";

@EntityRepository(ShowtimeEntity)
export class ShowtimeRepository extends Repository<ShowtimeEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  async createShowtime(createShowTimeDataDto: CreateShowTimeDataDto): Promise<number> {
    try {

      // const showTimeEntity = await this.save({
      //   title: createShowTimeDataDto.title,
      //   // name: createShowTimeDataDto.name.substring(0, createShowTimeDataDto.name.indexOf('#') -1),
      //   name: createShowTimeDataDto.name,
      //   artist: createShowTimeDataDto.artist,
      //   handle: createShowTimeDataDto.handle,
      //   description: createShowTimeDataDto.description,
      //   viewYn: 'Y',
      //   playTime: createShowTimeDataDto.playTime,
      //   playCount: 0,
      //   likeCount: 0,
      //   releaseStartAt: createShowTimeDataDto.releaseStartAt,
      //   releaseEndAt: createShowTimeDataDto.releaseEndAt,
      //   releaseYn: createShowTimeDataDto.releaseYn,
      //   minter: process.env.SHOWTIME_MINTER_ADDRESS,
      //   transactionHash: createShowTimeDataDto.transactionHash,
      //   lyrics: typeof createShowTimeDataDto.lyrics == 'undefined' || createShowTimeDataDto.lyrics == '' ? null : createShowTimeDataDto.lyrics,
      // });
      // return showTimeEntity.id;

      const showtime = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimeEntity)
        .values({
          title: createShowTimeDataDto.title,
          // name: createShowTimeDataDto.name.substring(0, createShowTimeDataDto.name.indexOf('#') -1),
          name: createShowTimeDataDto.name,
          artist: createShowTimeDataDto.artist,
          handle: createShowTimeDataDto.handle,
          description: createShowTimeDataDto.description,
          viewYn: 'Y',
          playTime: createShowTimeDataDto.playTime,
          playCount: 0,
          likeCount: 0,
          releaseStartAt: createShowTimeDataDto.releaseStartAt,
          releaseEndAt: createShowTimeDataDto.releaseEndAt,
          releaseYn: createShowTimeDataDto.releaseYn,
          minter: process.env.SHOWTIME_MINTER_ADDRESS,
          transactionHash: createShowTimeDataDto.transactionHash,
          lyrics: typeof createShowTimeDataDto.lyrics == 'undefined' || createShowTimeDataDto.lyrics == '' ? null : createShowTimeDataDto.lyrics,
        })
        .execute();

        return showtime.raw.insertId;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getLastShowTimeId(): Promise<number> {
    const lastInfo = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .orderBy('s.id', 'DESC')
      .limit(1)
      .getOne();

    if (!lastInfo) {
      return 1;
    }

    return Number(lastInfo.id) + 1;
  }

  async getUpcoming(showtimeId: number, userId: number): Promise<ResponseUpcomingDto> {
    const upcomingInfo = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .leftJoinAndSelect('sl.userEntity', 'ul')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .where('s.releaseYn = :releaseYn', {releaseYn: 'N'})
      .andWhere('s.id = :showtimeId', {showtimeId: showtimeId == 0 ? 68 : showtimeId})
      .andWhere('s.viewYn = :viewYn', {viewYn: 'Y'})
      .orderBy('s.id', 'DESC')
      .getOne();
    if (!upcomingInfo) {
      return new ResponseUpcomingDto();
    }

    const responseUpcomingDto = new ResponseUpcomingDto();
    responseUpcomingDto.artistHandle = [];
    responseUpcomingDto.producerHandle = [];
    for(const crew of upcomingInfo.showtimeCrewEntity) {
      if(crew.name == 'A') {
        for(const userFile of crew.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            responseUpcomingDto.artistImage = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            responseUpcomingDto.artistBannerImage = userFile.fileEntity.url;
          } else {
            responseUpcomingDto.artistImage = '';
          }
        }
        responseUpcomingDto.artistId = Number(crew.userEntity.id);
        // responseRecentDto.artistHandle.push(crew.userEntity.handle);
        const idHandleDto = new ResponseIdHandleDto();
        idHandleDto.artistId = crew.userEntity.id;
        idHandleDto.handle = crew.userEntity.handle;
        responseUpcomingDto.artistHandle.push(idHandleDto);
      } else if(crew.name == 'P') {
        // responseRecentDto.producerHandle.push(crew.userEntity.handle);
        const idHandleDto = new ResponseIdHandleDto();
        idHandleDto.artistId = crew.userEntity.id;
        idHandleDto.handle = crew.userEntity.handle;
        responseUpcomingDto.producerHandle.push(idHandleDto);
      }
    }

    responseUpcomingDto.showtimeId = Number(upcomingInfo.id);
    responseUpcomingDto.name = upcomingInfo.name;
    responseUpcomingDto.artist = upcomingInfo.artist;
    responseUpcomingDto.title = upcomingInfo.title;
    responseUpcomingDto.handle = upcomingInfo.handle;
    responseUpcomingDto.description = upcomingInfo.description;
    responseUpcomingDto.lyrics = upcomingInfo.lyrics;

    let genres = '';
    for(const showtimeGenre of upcomingInfo.showtimeGenreEntity) {
      genres += showtimeGenre.genreEntity.name + ', '
    }
    responseUpcomingDto.genres = genres.substring(0, genres.length-2);

    responseUpcomingDto.totalLikeCount = upcomingInfo.showtimeLikeEntity.length;
    responseUpcomingDto.isLike = false;
    if(upcomingInfo.showtimeLikeEntity.length > 0) {
      for(const showtimeLike of upcomingInfo.showtimeLikeEntity) {
        if(showtimeLike.userEntity.id == userId) {
          responseUpcomingDto.isLike = true;
          break;
        }
      }
    }

    let goldTotalCount = 0;
    let goldGrabCount = 0;
    let goldPrice = 0;
    let goldImage = '';
    let goldDescription = '';
    let platinumTotalCount = 0;
    let platinumGrabCount = 0;
    let platinumPrice = 0;
    let platinumImage = '';
    let platinumDescription = '';
    let diamondTotalCount = 0;
    let diamondGrabCount = 0;
    let diamondPrice = 0;
    let diamondImage = '';
    let diamondDescription = '';
    let dropTypes = [];
    let floorPrice = 0;
    for(const obj of upcomingInfo.showtimeTierEntity) {
      dropTypes.push(obj.tier);
      if(obj.tier == 'Gold') {
        goldTotalCount++;
        goldPrice = Number(obj.price);
        floorPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            goldImage = sf.fileEntity.url;
            break;
          }
        }
        goldDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          goldGrabCount++;
        }
      } else if(obj.tier == 'Platinum') {
        platinumTotalCount++;
        platinumPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            platinumImage = sf.fileEntity.url;
            break;
          }
        }
        platinumDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          platinumGrabCount++;
        }
      } else if(obj.tier == 'Diamond') {
        diamondTotalCount++;
        diamondPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            diamondImage = sf.fileEntity.url;
            break;
          }
        }
        diamondDescription = obj.description;
        if (obj.purchaseYn == 'Y') {
          diamondGrabCount++;
        }
      }
    }

    responseUpcomingDto.floorPrice = floorPrice;
    responseUpcomingDto.nftDrops = upcomingInfo.showtimeTierEntity.length;
    responseUpcomingDto.dropType = new Set(dropTypes).size;
    responseUpcomingDto.releaseYn = upcomingInfo.releaseYn;
    responseUpcomingDto.releaseStartAt = Formatter.dateFormatter(upcomingInfo.releaseStartAt);
    responseUpcomingDto.releaseEndAt = Formatter.dateFormatter(upcomingInfo.releaseEndAt);

    let memberships = [];
    const goldMembershipDto = new ResponseMembershipDto();
    goldMembershipDto.name = 'Gold';
    goldMembershipDto.artistId = responseUpcomingDto.artistId;
    goldMembershipDto.albumImage = goldImage;
    goldMembershipDto.artistImage = responseUpcomingDto.artistImage;
    goldMembershipDto.price = goldPrice;
    goldMembershipDto.totalAmount = goldTotalCount;
    goldMembershipDto.leftAmount = (goldTotalCount-goldGrabCount);
    goldMembershipDto.isAvailable = false;
    goldMembershipDto.description = goldDescription;
    memberships.push(goldMembershipDto);

    const platinumMembershipDto = new ResponseMembershipDto();
    platinumMembershipDto.name = 'Platinum';
    platinumMembershipDto.artistId = responseUpcomingDto.artistId;
    platinumMembershipDto.albumImage = platinumImage;
    platinumMembershipDto.artistImage = responseUpcomingDto.artistImage;
    platinumMembershipDto.price = platinumPrice;
    platinumMembershipDto.totalAmount = platinumTotalCount;
    platinumMembershipDto.leftAmount = (platinumTotalCount-platinumGrabCount);
    platinumMembershipDto.isAvailable = false;
    platinumMembershipDto.description = platinumDescription;
    memberships.push(platinumMembershipDto);

    const diamondMembershipDto = new ResponseMembershipDto();
    diamondMembershipDto.name = 'Diamond';
    diamondMembershipDto.artistId = responseUpcomingDto.artistId;
    diamondMembershipDto.albumImage = diamondImage;
    diamondMembershipDto.artistImage = responseUpcomingDto.artistImage;
    diamondMembershipDto.price = diamondPrice;
    diamondMembershipDto.totalAmount = diamondTotalCount;
    diamondMembershipDto.leftAmount = (diamondTotalCount-diamondGrabCount);
    diamondMembershipDto.isAvailable = false;
    diamondMembershipDto.description = diamondDescription;
    memberships.push(diamondMembershipDto);

    responseUpcomingDto.membership = memberships;

    return responseUpcomingDto;
  }

  async getAllShowtimes(): Promise<ResponseRecentListDto[]> {
    const allShowtimeList = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('s.nftMusicEntity', 'n')
      .leftJoinAndSelect('n.nftMusicLikeEntity', 'nl')
      // .where('s.releaseYn = :releaseYn', {releaseYn: 'Y'})
      .where('s.viewYn = :viewYn', {viewYn: 'Y'})
      // .andWhere('snl.userEntity = :userId', {userId: userId})
      .orderBy('s.releaseStartAt', 'DESC')
      .getMany();
    if (!allShowtimeList) {
      let responseList = [];
      const responseObj = new ResponseRecentListDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const recent of allShowtimeList) {
      const responseRecentDto = new ResponseRecentListDto();

      responseRecentDto.showtimeId = Number(recent.id);

      for(const crew of recent.showtimeCrewEntity) {
        if(crew.name == 'A') {
          for(const userFile of crew.userEntity.userFileEntity) {
            if(userFile.fileType == 'PROFILE') {
              responseRecentDto.artistImage = userFile.fileEntity.url;
            } else if(userFile.fileType == 'BANNER') {
              responseRecentDto.artistBannerImage = userFile.fileEntity.url;
            } else {
              responseRecentDto.artistImage = '';
            }
          }
          responseRecentDto.artistId = Number(crew.userEntity.id);
          break;
        }
      }

      let floorPrice = 0;
      let diamondImage = '';
      let musicFileUrl = '';
      for(const obj of recent.showtimeTierEntity) {
        if(obj.tier == 'Diamond') {
          for(const sf of obj.showtimeFileEntity) {
            if(sf.fileType == 'MUSIC') {
              musicFileUrl = sf.fileEntity.url;
            } else if(sf.fileType == 'IMAGE') {
              diamondImage = sf.fileEntity.url;
            }
          }
        }
        if(obj.tier == 'Gold') {
          floorPrice = Number(obj.price);
        }

        if(floorPrice > 0 && diamondImage != '') {
          break;
        }
      }
      responseRecentDto.showtimeId = Number(recent.id);
      responseRecentDto.name = recent.name;
      responseRecentDto.artist = recent.artist;
      responseRecentDto.title = recent.title;
      responseRecentDto.handle = recent.handle;
      responseRecentDto.floorPrice = floorPrice;
      responseRecentDto.albumImage = diamondImage;
      responseRecentDto.musicFileUrl = musicFileUrl;
      responseRecentDto.releaseYn = recent.releaseYn;
      responseRecentDto.releaseStartAt = Formatter.dateFormatter(recent.releaseStartAt);
      responseRecentDto.releaseEndAt = Formatter.dateFormatter(recent.releaseEndAt);
      responseRecentDto.soldoutYn = 'Y';
      responseRecentDto.playTime = recent.playTime;
      responseRecentDto.lyrics = recent.lyrics;
      for(const obj of recent.showtimeTierEntity) {
        responseRecentDto.tokenId = obj.tokenId;
        if(obj.purchaseYn == 'N') {
          responseRecentDto.soldoutYn = 'N';
          break;
        }
      }

      if(recent.nftMusicEntity != null) {
        responseRecentDto.nftMusicId = Number(recent.nftMusicEntity.id);
      }
      responseList.push(responseRecentDto);
    }

    return responseList;
  }

  async getLandingRecents(userId: number, sortNftDto: SortNftDto): Promise<InfoNftDto[]> {
    const recentList = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .leftJoinAndSelect('sl.userEntity', 'u')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .where('s.releaseYn = :releaseYn', {releaseYn: 'Y'})
      .andWhere('s.viewYn = :viewYn', {viewYn: 'Y'})
      .andWhere(typeof sortNftDto.genreIds != 'undefined' && sortNftDto.genreIds.length > 0 ? 'sg.genre_id in (:genreIds)' : '1 = 1', {genreIds: sortNftDto.genreIds})
      .take(sortNftDto.take)
      .skip(sortNftDto.skip)
      .orderBy('s.id', 'DESC')
      .getMany();


    if (!recentList) {
      let responseList = [];
      const responseObj = new InfoNftDto();
      responseList.push(responseObj);
      return responseList;
    }

    const entityManager = getManager();

    let responseList = [];
    for(const recent of recentList) {
      const responseRecentDto = new InfoNftDto();

      responseRecentDto.showtimeId = Number(recent.id);

      for(const crew of recent.showtimeCrewEntity) {
        if(crew.name == 'A') {
          for(const userFile of crew.userEntity.userFileEntity) {
            if(userFile.fileType == 'PROFILE') {
              responseRecentDto.artistImage = userFile.fileEntity.url;
            } else if(userFile.fileType == 'BANNER') {
              responseRecentDto.artistBannerImage = userFile.fileEntity.url;
            } else {
              responseRecentDto.artistImage = '';
            }
          }
          responseRecentDto.artistId = Number(crew.userEntity.id);
          break;
        }
      }

      let floorPrice = 0;
      let goldImage = '';
      let musicFileUrl = '';
      for(const obj of recent.showtimeTierEntity) {
        if(obj.tier == 'Gold') {
          floorPrice = Number(obj.price);
          for(const sf of obj.showtimeFileEntity) {
            if(sf.fileType == 'MUSIC') {
              musicFileUrl = sf.fileEntity.url;
            } else if(sf.fileType == 'IMAGE') {
              goldImage = sf.fileEntity.url;
            }
          }
          break;
        }
      }
      responseRecentDto.showtimeId = Number(recent.id);
      responseRecentDto.name = recent.name;
      responseRecentDto.artist = recent.artist;
      responseRecentDto.title = recent.title;
      responseRecentDto.handle = recent.handle;
      responseRecentDto.floorPrice = floorPrice;
      responseRecentDto.imgFileUrl = goldImage;
      responseRecentDto.musicFileUrl = musicFileUrl;
      responseRecentDto.lyrics = recent.lyrics;
      responseRecentDto.source = 'showtime';
      responseRecentDto.playTime = recent.playTime;
      responseRecentDto.likeCount = recent.showtimeLikeEntity.length;
      responseRecentDto.releaseDt = Formatter.dateFormatter(recent.createdAt);
      responseRecentDto.isLike = false;

      const streamObj = await entityManager.query(
        'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
        '( ' +
        'select token_id from showtime_tier where showtime_id = ? ' +
        ')'
        , [Number(recent.playTime), recent.id]);
      responseRecentDto.playCount = streamObj[0].totalStreams;

      for(const likeEntity of recent.showtimeLikeEntity) {
        if(likeEntity.userEntity.id == userId) {
          responseRecentDto.isLike = true;
        }
      }

      responseList.push(responseRecentDto);
    }

    return responseList;
  }

  async getRecent(showtimeId: number, userId: number): Promise<ResponseRecentDto> {
    const recentInfo = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .leftJoinAndSelect('sl.userEntity', 'ul')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimePurchaseHistoryEntity', 'sph')
      .leftJoinAndSelect('sph.userEntity', 'spu')
      .leftJoinAndSelect('spu.userFileEntity', 'spuf')
      .leftJoinAndSelect('spuf.fileEntity', 'spff')
      .leftJoinAndSelect('s.nftMusicEntity', 'n')
      .leftJoinAndSelect('s.showtimeMovieEntity', 'smv')
      .leftJoinAndSelect('smv.fileEntity', 'smvf')
      .where('s.id = :showtimeId', {showtimeId: showtimeId})
      .orderBy('sc.id', 'ASC')
      .addOrderBy('sph.id', 'DESC')
      .getOne();
    if (!recentInfo) {
      return new ResponseRecentDto();
    }

    const responseRecentDto = new ResponseRecentDto();
    responseRecentDto.artistHandle = [];
    responseRecentDto.producerHandle = [];
    for(const crew of recentInfo.showtimeCrewEntity) {
      if(crew.name == 'A') {
        for(const userFile of crew.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            responseRecentDto.artistImage = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            responseRecentDto.artistBannerImage = userFile.fileEntity.url;
          } else {
            responseRecentDto.artistImage = '';
          }
        }
        responseRecentDto.artistId = Number(crew.userEntity.id);
        // responseRecentDto.artistHandle.push(crew.userEntity.handle);
        const idHandleDto = new ResponseIdHandleDto();
        idHandleDto.artistId = crew.userEntity.id;
        idHandleDto.handle = crew.userEntity.handle;
        responseRecentDto.artistHandle.push(idHandleDto);
      } else if(crew.name == 'P') {
        // responseRecentDto.producerHandle.push(crew.userEntity.handle);
        const idHandleDto = new ResponseIdHandleDto();
        idHandleDto.artistId = crew.userEntity.id;
        idHandleDto.handle = crew.userEntity.handle;
        responseRecentDto.producerHandle.push(idHandleDto);
      }
    }

    responseRecentDto.showtimeId = Number(recentInfo.id);
    responseRecentDto.name = recentInfo.name;
    responseRecentDto.artist = recentInfo.artist;
    responseRecentDto.title = recentInfo.title;
    responseRecentDto.handle = recentInfo.handle;
    responseRecentDto.description = recentInfo.description;
    responseRecentDto.lyrics = recentInfo.lyrics;

    let genres = '';
    for(const showtimeGenre of recentInfo.showtimeGenreEntity) {
      genres += showtimeGenre.genreEntity.name + ', '
    }
    responseRecentDto.genres = genres.substring(0, genres.length-2);

    responseRecentDto.totalLikeCount = recentInfo.showtimeLikeEntity.length;
    responseRecentDto.isLike = false;
    if(recentInfo.showtimeLikeEntity.length > 0) {
      for(const showtimeLike of recentInfo.showtimeLikeEntity) {
        if(showtimeLike.userEntity.id == userId) {
          responseRecentDto.isLike = true;
          break;
        }
      }
    }

    if(recentInfo.nftMusicEntity.id != null) {
      responseRecentDto.nftMusicId = recentInfo.nftMusicEntity.id;
    }

    let goldTotalCount = 0;
    let goldGrabCount = 0;
    let goldPrice = 0;
    let goldImage = '';
    let goldDescription = '';
    let platinumTotalCount = 0;
    let platinumGrabCount = 0;
    let platinumPrice = 0;
    let platinumImage = '';
    let platinumDescription = '';
    let diamondTotalCount = 0;
    let diamondGrabCount = 0;
    let diamondPrice = 0;
    let diamondImage = '';
    let diamondDescription = '';
    let dropTypes = [];
    let floorPrice = 0;
    let ipfsHash = '';
    for(const obj of recentInfo.showtimeTierEntity) {
      dropTypes.push(obj.tier);
      if(obj.tier == 'Gold') {
        goldTotalCount++;
        goldPrice = Number(obj.price);
        floorPrice = Number(obj.price);
        ipfsHash = obj.ipfsHash;
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            goldImage = sf.fileEntity.url;
            break;
          }
        }
        goldDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          goldGrabCount++;
        }
      } else if(obj.tier == 'Platinum') {
        platinumTotalCount++;
        platinumPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            platinumImage = sf.fileEntity.url;
            break;
          }
        }
        platinumDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          platinumGrabCount++;
        }
      } else if(obj.tier == 'Diamond') {
        diamondTotalCount++;
        diamondPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            diamondImage = sf.fileEntity.url;
            break;
          }
        }
        diamondDescription = obj.description;
        if (obj.purchaseYn == 'Y') {
          diamondGrabCount++;
        }
      }
    }

    responseRecentDto.floorPrice = floorPrice;
    responseRecentDto.nftDrops = recentInfo.showtimeTierEntity.length;
    responseRecentDto.dropType = new Set(dropTypes).size;

    responseRecentDto.releaseStartAt = Formatter.dateFormatter(recentInfo.releaseStartAt);
    responseRecentDto.releaseEndAt = Formatter.dateFormatter(recentInfo.releaseEndAt);

    let memberships = [];
    const goldMembershipDto = new ResponseMembershipDto();
    goldMembershipDto.name = 'Gold';
    goldMembershipDto.artistId = responseRecentDto.artistId;
    goldMembershipDto.albumImage = goldImage;
    goldMembershipDto.artistImage = responseRecentDto.artistImage;
    goldMembershipDto.price = goldPrice;
    goldMembershipDto.totalAmount = goldTotalCount;
    goldMembershipDto.leftAmount = (goldTotalCount-goldGrabCount);
    goldMembershipDto.isAvailable = true;
    goldMembershipDto.description = goldDescription;
    memberships.push(goldMembershipDto);

    const platinumMembershipDto = new ResponseMembershipDto();
    platinumMembershipDto.name = 'Platinum';
    platinumMembershipDto.artistId = responseRecentDto.artistId;
    platinumMembershipDto.albumImage = platinumImage;
    platinumMembershipDto.artistImage = responseRecentDto.artistImage;
    platinumMembershipDto.price = platinumPrice;
    platinumMembershipDto.totalAmount = platinumTotalCount;
    platinumMembershipDto.leftAmount = (platinumTotalCount-platinumGrabCount);
    platinumMembershipDto.isAvailable = true;
    platinumMembershipDto.description = platinumDescription;
    memberships.push(platinumMembershipDto);

    const diamondMembershipDto = new ResponseMembershipDto();
    diamondMembershipDto.name = 'Diamond';
    diamondMembershipDto.artistId = responseRecentDto.artistId;
    diamondMembershipDto.albumImage = diamondImage;
    diamondMembershipDto.artistImage = responseRecentDto.artistImage;
    diamondMembershipDto.price = diamondPrice;
    diamondMembershipDto.totalAmount = diamondTotalCount;
    diamondMembershipDto.leftAmount = (diamondTotalCount-diamondGrabCount);
    diamondMembershipDto.isAvailable = true;
    diamondMembershipDto.description = diamondDescription;
    memberships.push(diamondMembershipDto);

    responseRecentDto.membership = memberships;

    responseRecentDto.transactionHash = recentInfo.transactionHash;
    responseRecentDto.ipfsHash = ipfsHash;
    responseRecentDto.provenance = [];

    for(const showtimeTier of recentInfo.showtimeTierEntity) {
      for(const purchase of showtimeTier.showtimePurchaseHistoryEntity) {
        const purchaseHistory = new ResponsePurchasehistoryDto();
        purchaseHistory.userId = Number(purchase.userEntity.id);
        purchaseHistory.boughtTier = showtimeTier.tier;
        purchaseHistory.boughtPrice = Number(showtimeTier.price);
        purchaseHistory.boughtAt = Formatter.dateFormatter(purchase.createdAt);
        purchaseHistory.userHandle = purchase.userEntity.handle;
        for(const userFile of purchase.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            purchaseHistory.userImage = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            purchaseHistory.userBannerImage = userFile.fileEntity.url;
          } else {
            purchaseHistory.userImage = '';
          }
        }
        purchaseHistory.symbol = purchase.symbol;
        responseRecentDto.provenance.push(purchaseHistory);
      }
    }

    responseRecentDto.movieUrl = [];
    for(const movie of recentInfo.showtimeMovieEntity) {
      responseRecentDto.movieUrl.push(movie.fileEntity.url);
    }

    const nftLikeInfo = await getRepository(NftMusicLikeEntity)
      .createQueryBuilder('nl')
      .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: recentInfo.nftMusicEntity.id})
      .andWhere('nl.userEntity = :userId', {userId: userId})
      .getOne()

    if (!nftLikeInfo) {
      responseRecentDto.isNftMusicLike = false;
    } else {
      responseRecentDto.isNftMusicLike = true;
    }

    return responseRecentDto;
  }

  async getLandingRecent(userId: number, showtimeId: number): Promise<ResponseRecentWebDto> {
    const recentInfo = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('u.userFollowerEntity', 'ufw')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .leftJoinAndSelect('sl.userEntity', 'ul')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeHolderEntity', 'sth')
      .leftJoinAndSelect('sth.userEntity', 'sthu')
      .leftJoinAndSelect('sthu.userFileEntity', 'sthuf')
      .leftJoinAndSelect('sthuf.fileEntity', 'fff')
      .leftJoinAndSelect('s.nftMusicEntity', 'n')
      .leftJoinAndSelect('s.showtimeMovieEntity', 'smv')
      .leftJoinAndSelect('smv.fileEntity', 'smvf')
      .leftJoinAndSelect('s.showtimeDistributorEntity', 'sdb')
      .where('s.id = :showtimeId', {showtimeId: showtimeId})
      .getOne();
    if (!recentInfo) {
      return new ResponseRecentWebDto();
    }

    const responseRecentWebDto = new ResponseRecentWebDto();
    responseRecentWebDto.showtimeId = Number(recentInfo.id);
    if(recentInfo.nftMusicEntity.id != null)  responseRecentWebDto.nftMusicId = Number(recentInfo.nftMusicEntity.id);
    responseRecentWebDto.name = recentInfo.name;
    responseRecentWebDto.artist = recentInfo.artist;
    responseRecentWebDto.title = recentInfo.title;
    responseRecentWebDto.description = recentInfo.description;
    responseRecentWebDto.lyrics = recentInfo.lyrics;
    responseRecentWebDto.releaseYn = recentInfo.releaseYn;
    responseRecentWebDto.releaseStartAt = Formatter.dateFormatter(recentInfo.releaseStartAt);
    responseRecentWebDto.releaseEndAt = Formatter.dateFormatter(recentInfo.releaseEndAt);

    for(const file of recentInfo.showtimeTierEntity[0].showtimeFileEntity) {
      if(file.fileType == 'IMAGE') {
        responseRecentWebDto.imgFileUrl = file.fileEntity.url;
      } else if(file.fileType == 'MUSIC') {
        responseRecentWebDto.musicFileUrl = file.fileEntity.url;
      }
    }

    responseRecentWebDto.artists = [];
    responseRecentWebDto.producers = [];
    for(const crew of recentInfo.showtimeCrewEntity) {
      const userInfoDto = new ResponseUserInfoDto();
      userInfoDto.userId = crew.userEntity.id;
      userInfoDto.handle = crew.userEntity.handle;
      userInfoDto.name = crew.userEntity.nickname;
      userInfoDto.address = crew.userEntity.address;
      for(const userFile of crew.userEntity.userFileEntity) {
        if(userFile.fileType == 'PROFILE') {
          userInfoDto.imgFileUrl = userFile.fileEntity.url;
        } else if(userFile.fileType == 'BANNER') {
          userInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
        } else {
          userInfoDto.imgFileUrl = '';
        }
      }
      userInfoDto.followerCount = crew.userEntity.userFollowerEntity.length;
      if(crew.name == 'A') {
        responseRecentWebDto.artists.push(userInfoDto);
      } else if(crew.name == 'P') {
        responseRecentWebDto.producers.push(userInfoDto);
      }
    }

    let goldTotalCount = 0;
    let goldGrabCount = 0;
    let goldPrice = 0;
    let goldImage = '';
    let goldDescription = '';
    let platinumTotalCount = 0;
    let platinumGrabCount = 0;
    let platinumPrice = 0;
    let platinumImage = '';
    let platinumDescription = '';
    let diamondTotalCount = 0;
    let diamondGrabCount = 0;
    let diamondPrice = 0;
    let diamondImage = '';
    let diamondDescription = '';
    let dropTypes = [];
    let floorPrice = 0;
    let ipfsHash = '';

    responseRecentWebDto.isOnSale = 'N';

    for(const obj of recentInfo.showtimeTierEntity) {
      dropTypes.push(obj.tier);
      if(obj.tier == 'Gold') {
        goldTotalCount++;
        goldPrice = Number(obj.price);
        floorPrice = Number(obj.price);
        ipfsHash = obj.ipfsHash;
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            goldImage = sf.fileEntity.url;
            break;
          }
        }
        goldDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          goldGrabCount++;
          responseRecentWebDto.isOnSale = 'Y';
        }
      } else if(obj.tier == 'Platinum') {
        platinumTotalCount++;
        platinumPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            platinumImage = sf.fileEntity.url;
            break;
          }
        }
        platinumDescription = obj.description;
        if(obj.purchaseYn == 'Y') {
          platinumGrabCount++;
          responseRecentWebDto.isOnSale = 'Y';
        }
      } else if(obj.tier == 'Diamond') {
        diamondTotalCount++;
        diamondPrice = Number(obj.price);
        for(const sf of obj.showtimeFileEntity) {
          if(sf.fileType == 'IMAGE') {
            diamondImage = sf.fileEntity.url;
            break;
          }
        }
        diamondDescription = obj.description;
        if (obj.purchaseYn == 'Y') {
          diamondGrabCount++;
          responseRecentWebDto.isOnSale = 'Y';
        }
      }
    }

    const entityManager = getManager();
    const streamObj = await entityManager.query(
      'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
      '( ' +
      'select token_id from showtime_tier where showtime_id = ? ' +
      ')'
      , [Number(recentInfo.playTime), showtimeId]);
    const songInfoDto = new ResponseSongInfoDto();
    songInfoDto.streams = streamObj[0].totalStreams;
    songInfoDto.likes = recentInfo.showtimeLikeEntity.length;
    songInfoDto.origin = 'showtime';
    responseRecentWebDto.songInfo = songInfoDto;

    const nftInfoDto = new ResponseNftInfoDto();
    const coinObj = await entityManager.query(
      'select rate from coin_marketrate where name = \'ethereum\' ');
    let coinToUsd = Number(coinObj[0].rate);

    nftInfoDto.leftAmount = (goldTotalCount-goldGrabCount) + (platinumTotalCount-platinumGrabCount) + (diamondTotalCount-diamondGrabCount);
    nftInfoDto.totalAmount = recentInfo.showtimeTierEntity.length;
    nftInfoDto.price = floorPrice;
    nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(floorPrice));
    responseRecentWebDto.nftInfo = nftInfoDto;

    const nftDrops = [];
    const nftDropsGoldDto = new ResponseNftInfoDto();
    nftDropsGoldDto.tier = 'GOLD';
    nftDropsGoldDto.imgFileUrl = goldImage;
    nftDropsGoldDto.totalAmount = goldTotalCount;
    nftDropsGoldDto.leftAmount = goldTotalCount-goldGrabCount;
    nftDropsGoldDto.price = goldPrice;
    nftDropsGoldDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(goldPrice));
    nftDropsGoldDto.description = goldDescription;
    nftDrops.push(nftDropsGoldDto);
    const nftDropsPlatinumDto = new ResponseNftInfoDto();
    nftDropsPlatinumDto.tier = 'PLATINUM';
    nftDropsPlatinumDto.imgFileUrl = platinumImage;
    nftDropsPlatinumDto.totalAmount = platinumTotalCount;
    nftDropsPlatinumDto.leftAmount = platinumTotalCount-platinumGrabCount;
    nftDropsPlatinumDto.price = platinumPrice;
    nftDropsPlatinumDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(platinumPrice));
    nftDropsPlatinumDto.description = platinumDescription;
    nftDrops.push(nftDropsPlatinumDto);
    const nftDropsDiamondDto = new ResponseNftInfoDto();
    nftDropsDiamondDto.tier = 'DIAMOND';
    nftDropsDiamondDto.imgFileUrl = diamondImage;
    nftDropsDiamondDto.totalAmount = diamondTotalCount;
    nftDropsDiamondDto.leftAmount = diamondTotalCount-diamondGrabCount;
    nftDropsDiamondDto.price = diamondPrice;
    nftDropsDiamondDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(diamondPrice));
    nftDropsDiamondDto.description = diamondDescription;
    nftDrops.push(nftDropsDiamondDto);
    responseRecentWebDto.nftDrops = nftDrops;

    const fellazList = [];

    let tokenIds = '';
    let i = 0;
    for(const tier of recentInfo.showtimeTierEntity) {
      for(const holder of tier.showtimeHolderEntity) {
        const fellazInfoDto = new ResponseUserInfoDto();
        fellazInfoDto.userId = holder.userEntity.id;
        for(const userFile of holder.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            fellazInfoDto.imgFileUrl = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            fellazInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
          } else {
            fellazInfoDto.imgFileUrl = '';
          }
        }
        fellazInfoDto.handle = holder.userEntity.handle;
        fellazList.push(fellazInfoDto);
      }
      if(i == 0) {
        tokenIds = tokenIds + tier.tokenId + ' ~ ';
      } else if(i == recentInfo.showtimeTierEntity.length-1) {
        tokenIds = tokenIds + tier.tokenId;
      }
      i++;

    }
    responseRecentWebDto.fellaz = fellazList.reduce(function(acc, current) {
      if (acc.findIndex(({ userId }) => userId === current.userId) === -1) {
        acc.push(current);
      }
      return acc;
    }, []);

    const contractInfoDto = new ResponseContractInfoDto();
    contractInfoDto.releaseDate = Formatter.dateFormatter(recentInfo.releaseStartAt);
    contractInfoDto.address = process.env.MILLIMX_NFT_CONTRACT;
    contractInfoDto.tokenId = tokenIds;
    contractInfoDto.tokenStandard = 'ERC721';
    contractInfoDto.blockchain = 'Ethereum';

    const splits = [];

    for(const distributor of recentInfo.showtimeDistributorEntity) {
      const splitStructureDto = new ResponseSplitStructureDto();
      splitStructureDto.address = distributor.address;
      splitStructureDto.percent = distributor.percent;
      splits.push(splitStructureDto);
    }

    contractInfoDto.splitStructure = splits;
    responseRecentWebDto.contractInfo = contractInfoDto;

    responseRecentWebDto.isLike = false;

    for(const likeEntity of recentInfo.showtimeLikeEntity) {
      if(likeEntity.userEntity.id == userId) {
        responseRecentWebDto.isLike = true;
      }
    }

    return responseRecentWebDto;
  }

  async getLandingCovers(): Promise<ResponseCoversDto[]> {
    const coverList = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .leftJoinAndSelect('sl.userEntity', 'ul')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimePurchaseHistoryEntity', 'sph')
      .leftJoinAndSelect('sph.userEntity', 'spu')
      .leftJoinAndSelect('spu.userFileEntity', 'spuf')
      .leftJoinAndSelect('spuf.fileEntity', 'spff')
      .leftJoinAndSelect('s.nftMusicEntity', 'n')
      .leftJoinAndSelect('s.showtimeMovieEntity', 'smv')
      .leftJoinAndSelect('smv.fileEntity', 'smvf')
      .orderBy('s.id', 'DESC')
      .getMany();

    const covers = [];

    if (!coverList) {
      return covers;
    }

    for(const cover of coverList) {
      const responseCoversDto = new ResponseCoversDto();

      responseCoversDto.showtimeId = Number(cover.id);
      responseCoversDto.name = cover.name;
      responseCoversDto.artist = cover.artist;
      responseCoversDto.title = cover.title;
      responseCoversDto.handle = cover.handle;
      responseCoversDto.description = cover.description;
      responseCoversDto.lyrics = cover.lyrics;
      responseCoversDto.source = 'showtime';

      let genres = '';
      for(const showtimeGenre of cover.showtimeGenreEntity) {
        genres += showtimeGenre.genreEntity.name + ', '
      }
      responseCoversDto.genres = genres.substring(0, genres.length-2);

      if(cover.nftMusicEntity != null) {
        responseCoversDto.nftMusicId = cover.nftMusicEntity.id;
      }

      let goldGrabCount = 0;
      let platinumGrabCount = 0;
      let diamondGrabCount = 0;
      let diamondImage = '';
      let floorPrice = 0;
      let musicFileUrl = '';

      for(const obj of cover.showtimeTierEntity) {
        if(obj.tier == 'Gold') {
          floorPrice = Number(obj.price);
          if(obj.purchaseYn == 'Y') {
            goldGrabCount++;
          }
        } else if(obj.tier == 'Platinum') {
          if(obj.purchaseYn == 'Y') {
            platinumGrabCount++;
          }
        } else if(obj.tier == 'Diamond') {
          for(const sf of obj.showtimeFileEntity) {
            if(sf.fileType == 'IMAGE') {
              diamondImage = sf.fileEntity.url;
            } else {
              musicFileUrl = sf.fileEntity.url;
            }
          }
          if (obj.purchaseYn == 'Y') {
            diamondGrabCount++;
          }
        }
      }

      responseCoversDto.floorPrice = floorPrice;

      const entityManager = getManager();
      const usdObj = await entityManager.query(
        'select rate from coin_marketrate where name = \'ethereum\' ');
      let coinToUsd = Number(usdObj[0].rate);
      responseCoversDto.floorCnutAmount = Math.ceil(coinToUsd * 10 * floorPrice);

      responseCoversDto.nftDrops = cover.showtimeTierEntity.length;
      responseCoversDto.nftGrabs = goldGrabCount + platinumGrabCount + diamondGrabCount;

      responseCoversDto.releaseYn = cover.releaseYn;
      responseCoversDto.releaseStartAt = Formatter.dateFormatter(cover.releaseStartAt);
      responseCoversDto.releaseEndAt = Formatter.dateFormatter(cover.releaseEndAt);

      responseCoversDto.musicFileUrl = musicFileUrl;
      responseCoversDto.imgFileUrl = diamondImage;

      covers.push(responseCoversDto);
    }
    return covers;
  }

  async getRecentByArtist(userId: number): Promise<ResponseArtistDetailDto[]> {
    const landingArtistInfo = await getRepository(ShowtimeEntity)
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
        .leftJoinAndSelect('sc.userEntity', 'uc')
        .leftJoinAndSelect('uc.userFileEntity', 'uf')
        .leftJoinAndSelect('uf.fileEntity', 'ff')
        .leftJoinAndSelect('s.showtimeTierEntity', 'st')
        .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
        .leftJoinAndSelect('stf.fileEntity', 'f')
        .where('sc.id = uc.id')
        .where('uc.id = :userId', {userId: userId})
        .orderBy('sc.id', 'ASC')
        .getMany();
    if (!landingArtistInfo) {
      let responseList = [];
      const responseObj = new ResponseArtistDetailDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const song of landingArtistInfo) {
      const responseArtistDetailDto = new ResponseArtistDetailDto();

      let imgFileUrl = '';
      let musicFileUrl = '';
      for(const obj of song.showtimeTierEntity) {
        if(obj.tier == 'Gold') {
          for(const sf of obj.showtimeFileEntity) {
            if(sf.fileType == 'MUSIC') {
              musicFileUrl = sf.fileEntity.url;
            }else if(sf.fileType == 'IMAGE') {
              imgFileUrl = sf.fileEntity.url;
              break;
            }
          }
        }
      }
      responseArtistDetailDto.showtimeId = Number(song.id);
      responseArtistDetailDto.artist = song.artist;
      responseArtistDetailDto.name = song.name;
      responseArtistDetailDto.title = song.title;
      responseArtistDetailDto.playTime = song.playTime;
      responseArtistDetailDto.playCount = song.playCount;
      responseArtistDetailDto.handle = song.handle;
      responseArtistDetailDto.imgFileUrl = imgFileUrl;
      responseArtistDetailDto.musicFileUrl = musicFileUrl;
      responseArtistDetailDto.source = 'showtime';

      responseList.push(responseArtistDetailDto);
    }


    return responseList;
  }

  async getFellazByArtist(userId: number, skip: number): Promise<ResponseUserInfoDto[]> {

    const take = skip == 0 ? 5 : 12;

    const fellazByArtist = await getRepository(ShowtimeEntity)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'uc')
      .leftJoinAndSelect('uc.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeHolderEntity', 'sth')
      .leftJoinAndSelect('sth.userEntity', 'sthu')
      .leftJoinAndSelect('sthu.userFileEntity', 'sthuf')
      .leftJoinAndSelect('sthuf.fileEntity', 'fff')
      .where('sc.id = uc.id')
      .andWhere('uc.id = :userId', {userId: userId})
      .orderBy('sc.id', 'ASC')
      .take(take)
      .skip(skip)
      .getMany();
    if (!fellazByArtist) {
      let responseList = [];
      const responseObj = new ResponseUserInfoDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];

    for(const song of fellazByArtist) {
      for(const obj of song.showtimeTierEntity) {
        if(obj.showtimeHolderEntity.length !== 0) {
          for(const holder of obj.showtimeHolderEntity) {
            const fellazInfoDto = new ResponseUserInfoDto();
            fellazInfoDto.userId = holder.userEntity.id;
            for(const userFile of holder.userEntity.userFileEntity) {
              if(userFile.fileType == 'PROFILE') {
                fellazInfoDto.imgFileUrl = userFile.fileEntity.url;
              } else if(userFile.fileType == 'BANNER') {
                fellazInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
              } else {
                fellazInfoDto.imgFileUrl = '';
              }
            }
            fellazInfoDto.name = holder.userEntity.nickname;
            fellazInfoDto.handle = holder.userEntity.handle;
            responseList.push(fellazInfoDto);
          }
        }
      }

      // responseList = responseList.reduce(function (acc, current) {
      //   if (acc.findIndex(({ userId }) => userId === current.userId) === -1) {
      //     acc.push(current);
      //   }
      //   return acc;
      // }, []);
    }

    return responseList;
  }


  async getServertime(): Promise<String> {

    const entityManager = getManager();
    const nowTime = await entityManager.query(
      'select now() as nowTime');

    return Formatter.dateFormatter(nowTime[0].nowTime);
  }
}
