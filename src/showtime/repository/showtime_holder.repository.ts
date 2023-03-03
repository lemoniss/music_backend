import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { PurchaseShowtimeDto } from "../dto/purchase.showtime.dto";
import { ShowtimeHolderEntity } from "../entity/showtime_holder.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { InfoFileDto } from "../../mymusic/dto/info.file.dto";
import { NftMusicLikeEntity } from "../../nftmusic/entity/nftmusic_like.entity";
import { ResponseUserInfoDto } from "../dto/response.userinfo.dto";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { ResponseSongInfoDto } from "../dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../dto/response.nftinfo.dto";
import { ResponseSplitStructureDto } from "../dto/response.splitstructure.dto";
import { ResponseContractInfoDto } from "../dto/response.contractinfo.dto";
import { Formatter } from "../../util/formatter";

@EntityRepository(ShowtimeHolderEntity)
export class ShowtimeHolderRepository extends Repository<ShowtimeHolderEntity> {

  /**
   * Showtime_홀더 내역
   * @param createUserDto
   */
  async createShowtimeHolder(purchaseShowtimeDto: PurchaseShowtimeDto) {
    try {
      const showtimeTierEntity = new ShowtimeTierEntity();
      showtimeTierEntity.id = purchaseShowtimeDto.showTimeTierId;

      const userEntity = new UserEntity();
      userEntity.id = purchaseShowtimeDto.userId;

      // await this.save({
      //   userEntity: userEntity,
      //   showtimeTierEntity: showtimeTierEntity,
      //   isOnSale: 'N',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimeHolderEntity)
        .values({
          userEntity: userEntity,
          showtimeTierEntity: showtimeTierEntity,
          isOnSale: 'N',
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getHolderShowtimes(userId: number): Promise<InfoNftDto[]> {

    const holderShowtimes = await getRepository(ShowtimeHolderEntity)
      .createQueryBuilder('sh')
      .leftJoinAndSelect('sh.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .where('sh.user_id = :userId', {userId: userId})
      .orderBy('sh.isOnSale', 'DESC')
      .addOrderBy('sh.id', 'DESC')
      .getMany();

    if (!holderShowtimes) {
      const infoNftDtos = [];
      const infoNftDto = new InfoNftDto();
      infoNftDtos.push(infoNftDto);
      return infoNftDtos;
    }

    const infoNftDtos = [];
    const entityManager = getManager();

    for(const holderEntity of holderShowtimes) {

      const exchangeObj = await entityManager.query(
        'select price from exchange e where token_id = ?'
        , [holderEntity.showtimeTierEntity.tokenId]);

      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = holderEntity.showtimeTierEntity.id;
      infoNftDto.title = holderEntity.showtimeTierEntity.showtimeEntity.title;
      infoNftDto.name = holderEntity.showtimeTierEntity.name;
      infoNftDto.artist = holderEntity.showtimeTierEntity.showtimeEntity.artist;
      infoNftDto.description = holderEntity.showtimeTierEntity.showtimeEntity.description;
      infoNftDto.lyrics = holderEntity.showtimeTierEntity.showtimeEntity.lyrics;
      infoNftDto.playTime = holderEntity.showtimeTierEntity.showtimeEntity.playTime;
      infoNftDto.isLike = holderEntity.showtimeTierEntity.showtimeEntity.showtimeLikeEntity.length > 0 ? true : false;
      infoNftDto.tokenId = holderEntity.showtimeTierEntity.tokenId;
      infoNftDto.isOnSale = holderEntity.isOnSale;
      // infoNftDto.price = holderEntity.showtimeTierEntity.price;
      infoNftDto.rareYn = holderEntity.showtimeTierEntity.rareYn;
      infoNftDto.tier = holderEntity.showtimeTierEntity.tier;
      infoNftDto.handle = holderEntity.showtimeTierEntity.showtimeEntity.handle;
      infoNftDto.rareImgFileUrl = [];

      if(exchangeObj.length > 0) infoNftDto.price = (Number(exchangeObj[0].price) / 10 ** 18).toString();

      for(const fileEntity of holderEntity.showtimeTierEntity.showtimeFileEntity) {
        switch (fileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = fileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = fileEntity.fileEntity.url;
            break;
          case 'RARE':
            infoNftDto.rareImgFileUrl.push(fileEntity.fileEntity.url);
            break;
        }
      }
      let genres = '';
      for(const genre of holderEntity.showtimeTierEntity.showtimeEntity.showtimeGenreEntity) {
        genres += genre.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);
      infoNftDto.source = 'showtime';
      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  async getLandingHolderShowtimes(userId: number): Promise<InfoNftDto[]> {

    const holderShowtimes = await getRepository(ShowtimeHolderEntity)
      .createQueryBuilder('sh')
      .leftJoinAndSelect('sh.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .where('sh.user_id = :userId', {userId: userId})
      .orderBy('sh.isOnSale', 'DESC')
      .addOrderBy('sh.id', 'DESC')
      .getMany();

    if (!holderShowtimes) {
      const infoNftDtos = [];
      const infoNftDto = new InfoNftDto();
      infoNftDtos.push(infoNftDto);
      return infoNftDtos;
    }

    const infoNftDtos = [];
    const entityManager = getManager();

    for(const holderEntity of holderShowtimes) {

      const exchangeObj = await entityManager.query(
        'select price from exchange e where token_id = ?'
        , [holderEntity.showtimeTierEntity.tokenId]);

      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = holderEntity.showtimeTierEntity.id;
      infoNftDto.title = holderEntity.showtimeTierEntity.showtimeEntity.title;
      infoNftDto.name = holderEntity.showtimeTierEntity.name;
      infoNftDto.artist = holderEntity.showtimeTierEntity.showtimeEntity.artist;
      infoNftDto.description = holderEntity.showtimeTierEntity.showtimeEntity.description;
      infoNftDto.lyrics = holderEntity.showtimeTierEntity.showtimeEntity.lyrics;
      infoNftDto.playTime = holderEntity.showtimeTierEntity.showtimeEntity.playTime;
      infoNftDto.isLike = holderEntity.showtimeTierEntity.showtimeEntity.showtimeLikeEntity.length > 0 ? true : false;
      infoNftDto.likeCount = holderEntity.showtimeTierEntity.showtimeEntity.showtimeLikeEntity.length;
      infoNftDto.tokenId = holderEntity.showtimeTierEntity.tokenId;
      infoNftDto.isOnSale = holderEntity.isOnSale;
      // infoNftDto.price = holderEntity.showtimeTierEntity.price;
      infoNftDto.rareYn = holderEntity.showtimeTierEntity.rareYn;
      infoNftDto.tier = holderEntity.showtimeTierEntity.tier;
      infoNftDto.rareImgFileUrl = [];
      infoNftDto.showtimeId = holderEntity.showtimeTierEntity.showtimeEntity.id;

      if(exchangeObj.length > 0) infoNftDto.price = exchangeObj[0].price;

      for(const fileEntity of holderEntity.showtimeTierEntity.showtimeFileEntity) {
        switch (fileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = fileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = fileEntity.fileEntity.url;
            break;
          case 'RARE':
            infoNftDto.rareImgFileUrl.push(fileEntity.fileEntity.url);
            break;
        }
      }

      const streamObj = await entityManager.query(
        'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
        '( ' +
        'select token_id from showtime_tier where showtime_id = ? ' +
        ')'
        , [Number(holderEntity.showtimeTierEntity.showtimeEntity.playTime), holderEntity.showtimeTierEntity.id]);

      infoNftDto.playCount = streamObj[0].totalStreams;

      let genres = '';
      for(const genre of holderEntity.showtimeTierEntity.showtimeEntity.showtimeGenreEntity) {
        genres += genre.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);
      infoNftDto.source = 'showtime';
      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  async getHolderShowtime(tierId: number, userId: number): Promise<InfoNftDto> {

    const holderShowtime = await getRepository(ShowtimeHolderEntity)
      .createQueryBuilder('sh')
      .leftJoinAndSelect('sh.userEntity', 'shu')
      .leftJoinAndSelect('shu.userFileEntity', 'shuf')
      .leftJoinAndSelect('shuf.fileEntity', 'shff')
      .leftJoinAndSelect('sh.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeCrewEntity', 'sc')
      .leftJoinAndSelect('sc.userEntity', 'u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('u.userFollowerEntity', 'ufw')
      .leftJoinAndSelect('s.nftMusicEntity', 'nft')
      .where('sh.showtimeTierEntity = :tierId', {tierId: tierId})
      .getOne();

    if (!holderShowtime) {
      throw new RuntimeException('Showtime Not Found');
    }

    const entityManager = getManager();
    const exchangeObj = await entityManager.query(
      'select id as exchangeId, item_id as itemId, price, source from exchange e where nft_music_id = ?'
      , [tierId]);

    const userObj = await entityManager.query(
      "select id, handle from ( " +
      "select u.id, u.handle from showtime_tier st " +
      "inner join showtime s " +
      "on st.showtime_id = s.id " +
      "inner join user u  " +
      "on s.handle = u.handle  " +
      "where st.id=? " +
      ") t limit 1"
      , [tierId]);

    const infoNftDto = new InfoNftDto();

    infoNftDto.nftMusicId = holderShowtime.showtimeTierEntity.id;
    infoNftDto.title = holderShowtime.showtimeTierEntity.showtimeEntity.title;
    infoNftDto.name = holderShowtime.showtimeTierEntity.name;
    infoNftDto.artist = holderShowtime.showtimeTierEntity.showtimeEntity.artist;
    infoNftDto.handle = holderShowtime.showtimeTierEntity.showtimeEntity.handle;
    infoNftDto.description = holderShowtime.showtimeTierEntity.showtimeEntity.description;
    infoNftDto.lyrics = holderShowtime.showtimeTierEntity.showtimeEntity.lyrics;
    infoNftDto.ipfsHash = holderShowtime.showtimeTierEntity.ipfsHash;
    infoNftDto.tokenId = holderShowtime.showtimeTierEntity.tokenId;
    infoNftDto.isOnSale = holderShowtime.isOnSale;
    infoNftDto.playTime = holderShowtime.showtimeTierEntity.showtimeEntity.playTime;
    infoNftDto.minter = 'Showtime';
    infoNftDto.tier = holderShowtime.showtimeTierEntity.tier;
    infoNftDto.rareYn = holderShowtime.showtimeTierEntity.rareYn;
    infoNftDto.showtimeId = holderShowtime.showtimeTierEntity.showtimeEntity.id;

    if(userObj.length > 0) {
      infoNftDto.userId = userObj[0].id;
      infoNftDto.handle = userObj[0].handle;
    }

    if(exchangeObj.length > 0) {
      infoNftDto.price = exchangeObj[0].price;
      infoNftDto.itemId = exchangeObj[0].itemId;
      infoNftDto.exchangeId = exchangeObj[0].exchangeId;
      infoNftDto.source = exchangeObj[0].source;
    } else {
      infoNftDto.source = 'showtime';
    }

    infoNftDto.artists = [];
    infoNftDto.producers = [];
    for(const crew of holderShowtime.showtimeTierEntity.showtimeEntity.showtimeCrewEntity) {
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
        infoNftDto.artists.push(userInfoDto);
      } else if(crew.name == 'P') {
        infoNftDto.producers.push(userInfoDto);
      }
    }

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
      .where('s.id = :showtimeId', {showtimeId: holderShowtime.showtimeTierEntity.showtimeEntity.id})
      .getOne();

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

    const streamObj = await entityManager.query(
      'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
      '( ' +
      'select token_id from showtime_tier where showtime_id = ? ' +
      ')'
      , [Number(recentInfo.playTime), holderShowtime.showtimeTierEntity.showtimeEntity.id]);
    const songInfoDto = new ResponseSongInfoDto();
    songInfoDto.streams = streamObj[0].totalStreams;
    songInfoDto.likes = recentInfo.showtimeLikeEntity.length;
    songInfoDto.origin = 'showtime';
    infoNftDto.songInfo = songInfoDto;

    const nftInfoDto = new ResponseNftInfoDto();
    const coinObj = await entityManager.query(
      'select rate from coin_marketrate where name = \'ethereum\' ');
    let coinToUsd = Number(coinObj[0].rate);

    nftInfoDto.leftAmount = (goldTotalCount-goldGrabCount) + (platinumTotalCount-platinumGrabCount) + (diamondTotalCount-diamondGrabCount);
    nftInfoDto.totalAmount = recentInfo.showtimeTierEntity.length;
    nftInfoDto.price = floorPrice;
    nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(floorPrice));
    infoNftDto.nftInfo = nftInfoDto;

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
    infoNftDto.fellaz = fellazList.reduce(function(acc, current) {
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
    infoNftDto.contractInfo = contractInfoDto;

    infoNftDto.rareImgFileUrl = [];

    let fileInfos = [];

    for(const fileEntity of holderShowtime.showtimeTierEntity.showtimeFileEntity) {
      switch (fileEntity.fileType) {
        case 'MUSIC':
          infoNftDto.musicFileUrl = fileEntity.fileEntity.url;
          infoNftDto.musicFileName = fileEntity.fileEntity.name;
          break;
        case 'IMAGE':
          infoNftDto.imgFileUrl = fileEntity.fileEntity.url;
          break;
        case 'RARE':
          infoNftDto.rareImgFileUrl.push(fileEntity.fileEntity.url);
          break;
      }
      const infoFileDto = new InfoFileDto();
      infoFileDto.fileId = fileEntity.fileEntity.id;
      infoFileDto.filetype = fileEntity.fileType;
      fileInfos.push(infoFileDto);
    }

    infoNftDto.files = fileInfos;

    let genres = '';
    let genreIds = [];

    for(const genreEntity of holderShowtime.showtimeTierEntity.showtimeEntity.showtimeGenreEntity) {
      genres += genreEntity.genreEntity.name + ', '
      genreIds.push(genreEntity.genreEntity.id);
    }

    infoNftDto.genres = genres.substring(0, genres.length-2);
    infoNftDto.genreIds = genreIds;
    infoNftDto.source = 'showtime';

    const nftLikeInfo = await getRepository(NftMusicLikeEntity)
      .createQueryBuilder('nl')
      .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: holderShowtime.showtimeTierEntity.showtimeEntity.nftMusicEntity.id})
      .andWhere('nl.userEntity = :userId', {userId: userId})
      .getOne()

    if (!nftLikeInfo) {
      infoNftDto.isLike = false;
    } else {
      infoNftDto.isLike = true;
    }

    return infoNftDto;
  }

  async patchOnSale(tierId: number, isOnSale: string) {
    await getConnection()
      .createQueryBuilder()
      .update(ShowtimeHolderEntity)
      .set({isOnSale: isOnSale})
      .where('showtimeTierEntity = :tierId', {tierId: tierId})
      .execute();
  }

  async deleteHolderShowtime(tierId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ShowtimeHolderEntity)
        .where('showtimeTierEntity = :tierId', {tierId: tierId})
        .execute();
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
