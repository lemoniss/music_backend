import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateExchangeDto } from "../dto/create.exchange.dto";
import { InfoExchangeDto } from "../dto/info.exchange.dto";
import { ExchangeEntity } from "../entity/exchange.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { SearchExchangeDto } from "../dto/search.exchange.dto";
import { NftMusicLikeEntity } from "../../nftmusic/entity/nftmusic_like.entity";
import { UserEntity } from "../../user/entity/user.entity";
import { ResponseContractInfoDto } from "../../showtime/dto/response.contractinfo.dto";
import { Formatter } from "../../util/formatter";
import { ResponseSongInfoDto } from "../../showtime/dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../../showtime/dto/response.nftinfo.dto";
import { ShowtimeEntity } from "../../showtime/entity/showtime.entity";
import { NftMusicEntity } from "../../nftmusic/entity/nftmusic.entity";
import { ResponseUserInfoDto } from "../../showtime/dto/response.userinfo.dto";
import { ResponseRecentWebDto } from "../../showtime/dto/response.recent_web.dto";
import { ResponseSplitStructureDto } from "../../showtime/dto/response.splitstructure.dto";
import { UserFollowerEntity } from "../../user/entity/user_follower.entity";

@EntityRepository(ExchangeEntity)
export class ExchangeRepository extends Repository<ExchangeEntity> {

  /**
   * 거래소 정보 생성
   * @param createUserDto
   */
  async registerExchangeItem(createExchangeDto: CreateExchangeDto, infoNftDto: InfoNftDto): Promise<number> {
    try {
      // const exchange = await this.save({
      //   ipfsHash: infoNftDto.ipfsHash,
      //   tokenId: infoNftDto.tokenId,
      //   itemId: createExchangeDto.itemId,
      //   price: createExchangeDto.price,
      //   minter: infoNftDto.minter,
      //   seller: createExchangeDto.seller,
      //   title: infoNftDto.title,
      //   name: infoNftDto.name,
      //   artist: infoNftDto.artist,
      //   handle: infoNftDto.handle,
      //   description: infoNftDto.description,
      //   playTime: infoNftDto.playTime,
      //   nftMusicId: createExchangeDto.nftMusicId,
      //   source: infoNftDto.source,
      //   tier: infoNftDto.tier,
      //   rareYn: infoNftDto.rareYn,
      //   lyrics: typeof infoNftDto.lyrics == 'undefined' || infoNftDto.lyrics == '' ? null : infoNftDto.lyrics,
      // });
      //
      // return exchange.id;
      const exchange = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ExchangeEntity)
        .values({
          ipfsHash: infoNftDto.ipfsHash,
          tokenId: infoNftDto.tokenId,
          itemId: createExchangeDto.itemId,
          price: createExchangeDto.price,
          minter: infoNftDto.minter,
          seller: createExchangeDto.seller,
          title: infoNftDto.title,
          name: infoNftDto.name,
          artist: infoNftDto.artist,
          handle: infoNftDto.handle,
          description: infoNftDto.description,
          playTime: infoNftDto.playTime,
          nftMusicId: createExchangeDto.nftMusicId,
          source: infoNftDto.source,
          tier: infoNftDto.tier,
          rareYn: infoNftDto.rareYn,
          lyrics: typeof infoNftDto.lyrics == 'undefined' || infoNftDto.lyrics == '' ? null : infoNftDto.lyrics,
        })
        .execute();

      return exchange.raw.insertId;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 거래소 음악 리스트 (검색도 있음)
   * 수정해야 하는 것: 기본적으로 정렬을 한 상태로 줄 것임.
   * 이렇게 되면 search 라우터는 따로 만들 필요가 없음.
   *
   * @param keyword
   */
  async findExchangeList(searchExchangeDto: SearchExchangeDto): Promise<InfoExchangeDto[]> {

    const exchangeList = await getRepository(ExchangeEntity)
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.exchangeFileEntity', 'ef')
      .innerJoinAndSelect('ef.fileEntity', 'f')
      .leftJoinAndSelect('e.exchangeGenreEntity', 'eg')
      .leftJoinAndSelect('e.userExchangeEntity', 'eu')
      .leftJoinAndSelect('eu.userEntity', 'u')
      .innerJoinAndSelect('eg.genreEntity', 'g')
      .where(typeof searchExchangeDto.keyword != 'undefined' ? '(e.name like :keyword or e.artist like :keyword)' : '1 = 1', {keyword: `%${searchExchangeDto.keyword}%`})
      .andWhere(typeof searchExchangeDto.genreIds != 'undefined' && searchExchangeDto.genreIds.length > 0 ? 'eg.genre_id in (:genreIds)' : '1 = 1', {genreIds: searchExchangeDto.genreIds})
      .orderBy('e.id', 'DESC')
      .getMany();
    if (!exchangeList) {
      throw new RuntimeException('ExchangeList Not Found');
    }
    const InfoExchangeDtos = [];

    const entityManager = getManager();

    for(const exchangeEntity of exchangeList) {
      for(const userEntity of exchangeEntity.userExchangeEntity) {
        console.log(userEntity.id)
      }

      const nftObj = await entityManager.query(
        'select ' +
        'n.play_count as playCount, ' +
        '(select count(*) from nft_music_like where nft_music_id = n.id) as likeCount ' +
        'from nft_music n where id = ?'
        , [exchangeEntity.nftMusicId]);

      const infoExchangeDto = new InfoExchangeDto();

      infoExchangeDto.exchangeId = Number(exchangeEntity.id);
      infoExchangeDto.itemId = Number(exchangeEntity.itemId);
      infoExchangeDto.tokenId = exchangeEntity.tokenId;
      infoExchangeDto.title = exchangeEntity.title;
      infoExchangeDto.name = exchangeEntity.name;
      infoExchangeDto.artist = exchangeEntity.artist;
      infoExchangeDto.handle = exchangeEntity.handle;
      infoExchangeDto.description = exchangeEntity.description;
      infoExchangeDto.playTime = Number(exchangeEntity.playTime);
      infoExchangeDto.price = (Number(exchangeEntity.price) / 10**18).toString();
      infoExchangeDto.seller = exchangeEntity.seller;
      infoExchangeDto.source = exchangeEntity.source;
      infoExchangeDto.tier = exchangeEntity.tier;
      infoExchangeDto.rareYn = exchangeEntity.rareYn;
      infoExchangeDto.lyrics = exchangeEntity.lyrics;

      if(nftObj.length > 0) {
        infoExchangeDto.playCount = Number(nftObj[0].playCount);
        infoExchangeDto.likeCount = Number(nftObj[0].likeCount);
      }

      for(const exchangeFileEntity of exchangeEntity.exchangeFileEntity) {
        switch (exchangeFileEntity.fileType) {
          case 'MUSIC':
            infoExchangeDto.musicFileUrl = exchangeFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoExchangeDto.imgFileUrl = exchangeFileEntity.fileEntity.url;
            break;
        }
      }
      let genres = '';
      for(const exchangeGenreEntity of exchangeEntity.exchangeGenreEntity) {
        genres += exchangeGenreEntity.genreEntity.name + ', '
      }
      infoExchangeDto.genres = genres.substring(0, genres.length-2);


      InfoExchangeDtos.push(infoExchangeDto);
    }
    return InfoExchangeDtos;
  }

  /**
   * 거래소 음악 상세
   * @param id
   */
  async findExchangeInfo(exchangeId: number, userId: number): Promise<InfoExchangeDto> {

    const exchangeInfo = await getRepository(ExchangeEntity)
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.exchangeFileEntity', 'ef')
      .leftJoinAndSelect('ef.fileEntity', 'f')
      .leftJoinAndSelect('e.exchangeGenreEntity', 'eg')
      .leftJoinAndSelect('eg.genreEntity', 'g')
      .leftJoinAndSelect('e.userExchangeEntity', 'eu')
      .leftJoinAndSelect('eu.userEntity', 'u')
      .where('e.id = :exchangeId', {exchangeId: exchangeId})
      .getOne();
    if (!exchangeInfo) {
      throw new RuntimeException('ExchangeInfo Not Found');
    }

    const infoExchangeDto = new InfoExchangeDto();

    infoExchangeDto.exchangeId = Number(exchangeInfo.id);
    infoExchangeDto.itemId = Number(exchangeInfo.itemId);
    infoExchangeDto.tokenId = exchangeInfo.tokenId;
    infoExchangeDto.title = exchangeInfo.title;
    infoExchangeDto.name = exchangeInfo.name;
    infoExchangeDto.artist = exchangeInfo.artist;
    infoExchangeDto.handle = exchangeInfo.handle;
    infoExchangeDto.description = exchangeInfo.description;
    infoExchangeDto.playTime = exchangeInfo.playTime;
    infoExchangeDto.price = (Number(exchangeInfo.price) / 10**18).toString();
    infoExchangeDto.seller = exchangeInfo.seller;
    infoExchangeDto.nftMusicId = Number(exchangeInfo.nftMusicId);
    // infoExchangeDto.userId = exchangeInfo.userExchangeEntity[0].userEntity.id;
    // infoExchangeDto.handle = exchangeInfo.userExchangeEntity[0].userEntity.handle;
    infoExchangeDto.source = exchangeInfo.source;
    infoExchangeDto.tier = exchangeInfo.tier;
    infoExchangeDto.rareYn = exchangeInfo.rareYn;
    infoExchangeDto.lyrics = exchangeInfo.lyrics;
    const entityManager = getManager();
    const userObj = await entityManager.query(
      "select id, handle from ( " +
      "select u.id, u.handle from nft_music n " +
      "inner join user u  " +
      "on n.handle = u.handle  " +
      "where n.id=? and n.source != 'catalog' " +
      "union " +
      "select u.id, u.handle from showtime_tier st " +
      "inner join showtime s " +
      "on st.showtime_id = s.id " +
      "inner join user u  " +
      "on s.handle = u.handle  " +
      "where st.id=? " +
      ") t limit 1"
      , [exchangeInfo.nftMusicId, exchangeInfo.nftMusicId]);
    if(userObj.length > 0) {
      infoExchangeDto.userId = userObj[0].id;
      infoExchangeDto.handle = userObj[0].handle;
    }

    // const nftObj = await entityManager.query(
    //   'select ' +
    //   'n.play_count as playCount, ' +
    //   '(select count(*) from nft_music_like where nft_music_id = n.id) as likeCount, ' +
    //   'ifnull(n.showtime_id, 0) as showTimeId ' +
    //   'from nft_music n where id = ?'
    //   , [exchangeInfo.nftMusicId]);
    //
    // if(nftObj.length > 0) {
    //   infoExchangeDto.playCount = Number(nftObj[0].playCount);
    //   infoExchangeDto.likeCount = Number(nftObj[0].likeCount);
    //   infoExchangeDto.showTimeId = Number(nftObj[0].showTimeId);
    // } else {
    //   infoExchangeDto.showTimeId = 0;
    // }
    infoExchangeDto.rareImgFileUrl = [];
    for(const exchangeFileEntity of exchangeInfo.exchangeFileEntity) {
      switch (exchangeFileEntity.fileType) {
        case 'MUSIC':
          infoExchangeDto.musicFileUrl = exchangeFileEntity.fileEntity.url;
          break;
        case 'IMAGE':
          infoExchangeDto.imgFileUrl = exchangeFileEntity.fileEntity.url;
          break;
        case 'RARE':
          infoExchangeDto.rareImgFileUrl.push(exchangeFileEntity.fileEntity.url);
          break;
      }
    }
    let genres = '';
    for(const exchangeGenreEntity of exchangeInfo.exchangeGenreEntity) {
      genres += exchangeGenreEntity.genreEntity.name + ', '
    }
    infoExchangeDto.genres = genres.substring(0, genres.length-2);

    const nftLikeInfo = await getRepository(NftMusicLikeEntity)
      .createQueryBuilder('nl')
      .leftJoinAndSelect('nl.userEntity', 'u')
      .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: exchangeInfo.nftMusicId})
      .andWhere('u.id = :userId', {userId: userId})
      .getOne()

    if (!nftLikeInfo) {
      infoExchangeDto.isLike = false;
    } else {
      infoExchangeDto.isLike = true;
    }

    const songInfoDto = new ResponseSongInfoDto();
    const nftInfoDto = new ResponseNftInfoDto();
    const contractInfoDto = new ResponseContractInfoDto();

    exchangeInfo.price = (Number(exchangeInfo.price) / 10**18).toString();

    if(exchangeInfo.source == 'showtime') {

      const recentLikeInfo = await getRepository(ShowtimeEntity)
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
        .leftJoinAndSelect('s.showtimeTierEntity', 'st')
        .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
        .leftJoinAndSelect('sc.userEntity', 'u')
        .leftJoinAndSelect('u.userFileEntity', 'uf')
        .leftJoinAndSelect('uf.fileEntity', 'ff')
        .leftJoinAndSelect('st.showtimeHolderEntity', 'sth')
        .leftJoinAndSelect('sth.userEntity', 'sthu')
        .leftJoinAndSelect('sthu.userFileEntity', 'sthuf')
        .leftJoinAndSelect('sthuf.fileEntity', 'fff')
        .leftJoinAndSelect('u.userFollowerEntity', 'ufw')
        .where('st.id = :tierId', {tierId: exchangeInfo.nftMusicId})
        .getOne();

      infoExchangeDto.showTimeId = recentLikeInfo.id;

      infoExchangeDto.artists = [];
      infoExchangeDto.producers = [];
      for(const crew of recentLikeInfo.showtimeCrewEntity) {
        const userInfoDto = new ResponseUserInfoDto();
        userInfoDto.userId = crew.userEntity.id;
        userInfoDto.handle = crew.userEntity.handle;
        userInfoDto.name = crew.userEntity.nickname;
        userInfoDto.address = crew.userEntity.address;
        userInfoDto.isFollowing = false;
        for(const userFile of crew.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            userInfoDto.imgFileUrl = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            userInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
          } else {
            userInfoDto.imgFileUrl = '';
          }
        }
        // userInfoDto.followerCount = crew.userEntity.userFollowerEntity.length;
        // for(const userFollower of crew.userEntity.userFollowerEntity) {
        //   if(userFollower.followerEntity.id == userId) {
        //     userInfoDto.isFollowing = true;
        //   }
        // }
        userInfoDto.isFollowing = false;
        userInfoDto.followerCount = 0;
        userInfoDto.followingCount = 0;

        const userFollowEntity = await getRepository(UserFollowerEntity)
          .createQueryBuilder('uf')
          .leftJoinAndSelect('uf.userEntity', 'ufu')
          .leftJoinAndSelect('uf.followerEntity', 'uff')
          .where('uf.userEntity = :artistId', {artistId: userInfoDto.userId})
          .orWhere('uf.followerEntity = :artistId', {artistId: userInfoDto.userId})
          .getMany();

        for(const follow of userFollowEntity) {
          if(follow.userEntity.id == userId) {
            userInfoDto.isFollowing = true;
          }
          if(follow.userEntity.id == userInfoDto.userId) {
            userInfoDto.followingCount++;
          }
          if(follow.followerEntity.id == userInfoDto.userId) {
            userInfoDto.followerCount++;
          }
        }

        if(crew.name == 'A') {
          infoExchangeDto.artists.push(userInfoDto);
        } else if(crew.name == 'P') {
          infoExchangeDto.producers.push(userInfoDto);
        }
      }

      const fellazList = [];

      let tokenIds = '';
      let i = 0;
      for(const tier of recentLikeInfo.showtimeTierEntity) {
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
        } else if(i == recentLikeInfo.showtimeTierEntity.length-1) {
          tokenIds = tokenIds + tier.tokenId;
        }
        i++;

      }
      infoExchangeDto.fellaz = fellazList.reduce(function(acc, current) {
        if (acc.findIndex(({ userId }) => userId === current.userId) === -1) {
          acc.push(current);
        }
        return acc;
      }, []);

      const streamObj = await entityManager.query(
        'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
        '( ' +
        'select token_id from showtime_tier where showtime_id = ? ' +
        ')'
        , [Number(exchangeInfo.playTime), exchangeInfo.nftMusicId]);

      songInfoDto.streams = streamObj[0].totalStreams;
      songInfoDto.likes = recentLikeInfo.showtimeLikeEntity.length;
      songInfoDto.origin = 'showtime';

      const recentInfo = await getRepository(ShowtimeEntity)
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.showtimeTierEntity', 'st')
        .leftJoinAndSelect('s.showtimeDistributorEntity', 'sdb')
        .where('s.id = :showtimeId', {showtimeId: recentLikeInfo.id})
        .getOne();

      const coinObj = await entityManager.query(
        'select rate from coin_marketrate where name = \'ethereum\' ');
      let coinToUsd = Number(coinObj[0].rate);

      let goldTotalCount = 0;
      let goldGrabCount = 0;
      let goldPrice = 0;
      let platinumTotalCount = 0;
      let platinumGrabCount = 0;
      let platinumPrice = 0;
      let diamondTotalCount = 0;
      let diamondGrabCount = 0;
      let diamondPrice = 0;

      for(const obj of recentInfo.showtimeTierEntity) {
        if(obj.tier == 'Gold') {
          goldTotalCount++;
          goldPrice = Number(obj.price);
          if(obj.purchaseYn == 'Y') {
            goldGrabCount++;
          }
        } else if(obj.tier == 'Platinum') {
          platinumTotalCount++;
          platinumPrice = Number(obj.price);
          if(obj.purchaseYn == 'Y') {
            platinumGrabCount++;
          }
        } else if(obj.tier == 'Diamond') {
          diamondTotalCount++;
          diamondPrice = Number(obj.price);
          if (obj.purchaseYn == 'Y') {
            diamondGrabCount++;
          }
        }
      }

      nftInfoDto.leftAmount = (goldTotalCount-goldGrabCount) + (platinumTotalCount-platinumGrabCount) + (diamondTotalCount-diamondGrabCount);
      nftInfoDto.totalAmount = recentInfo.showtimeTierEntity.length;
      nftInfoDto.price = Number(exchangeInfo.price);
      nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(exchangeInfo.price));

      contractInfoDto.releaseDate = Formatter.dateFormatter(recentInfo.createdAt);

      const splits = [];

      for(const distributor of recentInfo.showtimeDistributorEntity) {
        const splitStructureDto = new ResponseSplitStructureDto();
        splitStructureDto.address = distributor.address;
        splitStructureDto.percent = distributor.percent;
        splits.push(splitStructureDto);
      }

      contractInfoDto.splitStructure = splits;
    } else {

      const nftInfo = await getRepository(NftMusicEntity)
        .createQueryBuilder('n')
        .leftJoinAndSelect('n.nftMusicFileEntity', 'nf')
        .leftJoinAndSelect('nf.fileEntity', 'f')
        .leftJoinAndSelect('n.nftMusicLikeEntity', 'nl')
        .leftJoinAndSelect('n.nftMusicGenreEntity', 'ng')
        .leftJoinAndSelect('ng.genreEntity', 'g')
        .leftJoinAndSelect('n.userNftMusicEntity', 'nun')
        .leftJoinAndSelect('nun.userEntity', 'u')
        .leftJoinAndSelect('u.userFileEntity', 'uf')
        .leftJoinAndSelect('uf.fileEntity', 'ff')
        .leftJoinAndSelect('n.nftMusicDistributorEntity', 'nd')
        .where('n.id = :nftMusicId', {nftMusicId: exchangeInfo.nftMusicId})
        .getOne();

      infoExchangeDto.artists = [];

      if(nftInfo.source != 'catalog') {
        const userInfo = await getRepository(UserEntity)
          .createQueryBuilder('u')
          .leftJoinAndSelect('u.userFileEntity', 'uf')
          .leftJoinAndSelect('uf.fileEntity', 'ff')
          .where('u.handle = :handle', {handle: nftInfo.handle})
          .getOne();
        if (!userInfo) {
          return new InfoExchangeDto();
        }

        const userInfoDto = new ResponseUserInfoDto();
        userInfoDto.userId = userInfo.id;
        userInfoDto.handle = userInfo.handle;
        userInfoDto.name = userInfo.nickname
        userInfoDto.address = userInfo.address
        for(const userFile of userInfo.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            userInfoDto.imgFileUrl = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            userInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
          } else {
            userInfoDto.imgFileUrl = '';
          }
        }
        // userInfoDto.followerCount = userInfo.userFollowerEntity.length;
        // for(const userFollower of userInfo.userFollowerEntity) {
        //   if(userFollower.followerEntity.id == userId) {
        //     userInfoDto.isFollowing = true;
        //   }
        // }

        const userFollowEntity = await getRepository(UserFollowerEntity)
          .createQueryBuilder('uf')
          .leftJoinAndSelect('uf.userEntity', 'ufu')
          .leftJoinAndSelect('uf.followerEntity', 'uff')
          .where('uf.userEntity = :artistId', {artistId: userInfoDto.userId})
          .orWhere('uf.followerEntity = :artistId', {artistId: userInfoDto.userId})
          .getMany();

        for(const follow of userFollowEntity) {
          if(follow.userEntity.id == userId) {
            userInfoDto.isFollowing = true;
          }
          if(follow.userEntity.id == userInfoDto.userId) {
            userInfoDto.followingCount++;
          }
          if(follow.followerEntity.id == userInfoDto.userId) {
            userInfoDto.followerCount++;
          }
        }

        infoExchangeDto.artists.push(userInfoDto);
      }

      const fellazList = new Set<ResponseUserInfoDto>();

      for(const holder of nftInfo.userNftMusicEntity) {
        const fellazInfoDto = new ResponseUserInfoDto();
        fellazInfoDto.userId = holder.userEntity.id;
        fellazInfoDto.handle = holder.userEntity.handle;
        for(const userFile of holder.userEntity.userFileEntity) {
          if(userFile.fileType == 'PROFILE') {
            fellazInfoDto.imgFileUrl = userFile.fileEntity.url;
          } else if(userFile.fileType == 'BANNER') {
            fellazInfoDto.imgBannerFileUrl = userFile.fileEntity.url;
          } else {
            fellazInfoDto.imgFileUrl = '';
          }
        }
        fellazList.add(fellazInfoDto);
      }

      infoExchangeDto.fellaz = Array.from(fellazList);

      const streamObj = await entityManager.query(
        'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
        '( ' +
        'select token_id from nft_music where id = ? ' +
        ')'
        , [Number(exchangeInfo.playTime), exchangeInfo.nftMusicId]);

      songInfoDto.streams = streamObj[0].totalStreams;
      songInfoDto.likes = nftInfo.nftMusicLikeEntity.length;
      songInfoDto.origin = nftInfo.source;

      const coinObj = await entityManager.query(
        'select rate from coin_marketrate where name = \'ethereum\' ');
      let coinToUsd = Number(coinObj[0].rate);

      nftInfoDto.leftAmount = 1;
      nftInfoDto.totalAmount = 1;
      nftInfoDto.price = Number(exchangeInfo.price);
      nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(exchangeInfo.price));

      contractInfoDto.releaseDate = Formatter.dateFormatter(nftInfo.createdAt);

      let splits = [];

      for(const distributor of nftInfo.nftMusicDistributorEntity) {
        const splitStructureDto = new ResponseSplitStructureDto();
        splitStructureDto.address = distributor.address;
        splitStructureDto.percent = distributor.percent;
        splits.push(splitStructureDto);
      }
      contractInfoDto.splitStructure = splits;
    }

    infoExchangeDto.songInfo = songInfoDto;
    infoExchangeDto.nftInfo = nftInfoDto;

    contractInfoDto.address = process.env.MILLIMX_NFT_CONTRACT;
    contractInfoDto.tokenId = exchangeInfo.tokenId;
    contractInfoDto.tokenStandard = 'ERC721';
    contractInfoDto.blockchain = 'Ethereum';
    infoExchangeDto.contractInfo = contractInfoDto;

    return infoExchangeDto;
  }

  /**
   * 거래소 음악 상세
   * @param id
   */
  async findExchangeInfoByTokenId(tokenId: number): Promise<InfoExchangeDto> {

    const exchangeInfo = await getRepository(ExchangeEntity)
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.exchangeFileEntity', 'ef')
      .leftJoinAndSelect('ef.fileEntity', 'f')
      .leftJoinAndSelect('e.exchangeGenreEntity', 'eg')
      .leftJoinAndSelect('eg.genreEntity', 'g')
      .leftJoinAndSelect('e.userExchangeEntity', 'eu')
      .leftJoinAndSelect('eu.userEntity', 'u')
      .where('e.tokenId = :tokenId', {tokenId: tokenId})
      .getOne();
    if (!exchangeInfo) {
      throw new RuntimeException('ExchangeInfo Not Found');
    }

    const infoExchangeDto = new InfoExchangeDto();

    infoExchangeDto.exchangeId = Number(exchangeInfo.id);
    infoExchangeDto.itemId = Number(exchangeInfo.itemId);
    infoExchangeDto.tokenId = exchangeInfo.tokenId;
    infoExchangeDto.title = exchangeInfo.title;
    infoExchangeDto.name = exchangeInfo.name;
    infoExchangeDto.artist = exchangeInfo.artist;
    infoExchangeDto.handle = exchangeInfo.handle;
    infoExchangeDto.description = exchangeInfo.description;
    infoExchangeDto.playTime = Number(exchangeInfo.playTime);
    infoExchangeDto.price = exchangeInfo.price;
    infoExchangeDto.seller = exchangeInfo.seller;
    infoExchangeDto.nftMusicId = Number(exchangeInfo.nftMusicId);
    infoExchangeDto.handle = exchangeInfo.userExchangeEntity[0].userEntity.handle;
    infoExchangeDto.source = exchangeInfo.source;
    infoExchangeDto.tier = exchangeInfo.tier;
    infoExchangeDto.rareYn = exchangeInfo.rareYn;
    infoExchangeDto.lyrics = exchangeInfo.lyrics;
    const entityManager = getManager();
    const nftObj = await entityManager.query(
      'select ' +
      'n.play_count as playCount, ' +
      '(select count(*) from nft_music_like where nft_music_id = n.id) as likeCount ' +
      'from nft_music n where id = ?'
      , [exchangeInfo.nftMusicId]);

    if(nftObj.length > 0) {
      infoExchangeDto.playCount = Number(nftObj[0].playCount);
      infoExchangeDto.likeCount = Number(nftObj[0].likeCount);
    }
    infoExchangeDto.rareImgFileUrl = [];
    for(const exchangeFileEntity of exchangeInfo.exchangeFileEntity) {
      switch (exchangeFileEntity.fileType) {
        case 'MUSIC':
          infoExchangeDto.musicFileUrl = exchangeFileEntity.fileEntity.url;
          break;
        case 'IMAGE':
          infoExchangeDto.imgFileUrl = exchangeFileEntity.fileEntity.url;
          break;
        case 'RARE':
          infoExchangeDto.rareImgFileUrl.push(exchangeFileEntity.fileEntity.url);
          break;
      }
    }
    let genres = '';
    for(const exchangeGenreEntity of exchangeInfo.exchangeGenreEntity) {
      genres += exchangeGenreEntity.genreEntity.name + ', '
    }
    infoExchangeDto.genres = genres.substring(0, genres.length-2);

    return infoExchangeDto;
  }

  /**
   * 거래소 정보 삭제
   * @param exchangeId
   */
  async deleteExchange(exchangeId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ExchangeEntity)
        .where('id = :exchangeId', {exchangeId: exchangeId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
