import { getManager, EntityRepository, getRepository, Repository, getConnection } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { CreateNftDto } from "../dto/create.nft.dto";
import { InfoMusicDto } from "../../mymusic/dto/info.music.dto";
import { InfoNftDto } from "../dto/info.nft.dto";
import { SortNftDto } from "../dto/sort.nft.dto";
import { FindByUserNftDto } from "../dto/findbyuser.nft.dto";
import { InfoFileDto } from "../../mymusic/dto/info.file.dto";
import { NftMusicLikeEntity } from "../entity/nftmusic_like.entity";
import { ResponseRecentWebDto } from "../../showtime/dto/response.recent_web.dto";
import { ResponseUserInfoDto } from "../../showtime/dto/response.userinfo.dto";
import { UserEntity } from "../entity/user.entity";
import { ResponseSongInfoDto } from "../../showtime/dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../../showtime/dto/response.nftinfo.dto";
import { ResponseContractInfoDto } from "../../showtime/dto/response.contractinfo.dto";
import { ShowtimeTierRepository } from "../../showtime/repository/showtime_tier.repository";
import { Formatter } from "../../util/formatter";

@EntityRepository(NftMusicEntity)
export class NftMusicRepository extends Repository<NftMusicEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  async createNft(createNftDto: CreateNftDto, infoMusicDto: InfoMusicDto): Promise<number> {
    try {
      // const nftMusic = await this.save({
      //   ipfsHash: createNftDto.tokenUri,
      //   tokenId: createNftDto.tokenId,
      //   minter: createNftDto.minter,
      //   title: infoMusicDto.title,
      //   name: infoMusicDto.name,
      //   artist: infoMusicDto.artist,
      //   handle: infoMusicDto.handle,
      //   description: infoMusicDto.description,
      //   lyrics: typeof infoMusicDto.lyrics == 'undefined' || infoMusicDto.lyrics == '' ? null : infoMusicDto.lyrics,
      //   playTime: infoMusicDto.playTime,
      //   playCount: 0,
      //   isOnSale: 'N',
      //   source: 'normal',
      // });
      //
      // return nftMusic.id;

      const nftMusic = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftMusicEntity)
        .values({
          ipfsHash: createNftDto.tokenUri,
          tokenId: createNftDto.tokenId,
          minter: createNftDto.minter,
          title: infoMusicDto.title,
          name: infoMusicDto.name,
          artist: infoMusicDto.artist,
          handle: infoMusicDto.handle,
          description: infoMusicDto.description,
          lyrics: typeof infoMusicDto.lyrics == 'undefined' || infoMusicDto.lyrics == '' ? null : infoMusicDto.lyrics,
          playTime: infoMusicDto.playTime,
          playCount: 0,
          isOnSale: 'N',
          source: 'normal',
        })
        .execute();

      return nftMusic.raw.insertId;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async findMyNftList(userId: number): Promise<InfoNftDto[]> {

    const nftList = await getRepository(NftMusicEntity)
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.nftMusicFileEntity', 'nf')
      .innerJoinAndSelect('nf.fileEntity', 'f')
      .leftJoinAndSelect('n.nftMusicGenreEntity', 'ng')
      .innerJoinAndSelect('ng.genreEntity', 'g')
      .innerJoinAndSelect('n.userNftMusicEntity', 'un')
      .where('un.user_id = :userId', {userId: userId})
      .orderBy('n.isOnSale', 'DESC')
      .addOrderBy('n.id', 'DESC')
      .getMany();

    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];
    const entityManager = getManager();

    for(const nftEntity of nftList) {
      const exchangeObj = await entityManager.query(
        'select price from exchange e where token_id = ?'
      , [nftEntity.tokenId]);
      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      infoNftDto.playTime = nftEntity.playTime;
      infoNftDto.isLike = false;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.isOnSale = nftEntity.isOnSale;

      if(exchangeObj.length > 0) infoNftDto.price = (Number(exchangeObj[0].price) / 10 ** 18).toString();

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }
      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);
      infoNftDto.source = 'normal';
      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  async getLandingMyNftList(userId: number): Promise<InfoNftDto[]> {

    const nftList = await getRepository(NftMusicEntity)
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.nftMusicFileEntity', 'nf')
      .innerJoinAndSelect('nf.fileEntity', 'f')
      .leftJoinAndSelect('n.nftMusicGenreEntity', 'ng')
      .innerJoinAndSelect('ng.genreEntity', 'g')
      .innerJoinAndSelect('n.userNftMusicEntity', 'un')
      .where('un.user_id = :userId', {userId: userId})
      .orderBy('n.isOnSale', 'DESC')
      .addOrderBy('n.id', 'DESC')
      .getMany();

    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];
    const entityManager = getManager();

    for(const nftEntity of nftList) {
      const exchangeObj = await entityManager.query(
        'select price from exchange e where token_id = ?'
        , [nftEntity.tokenId]);
      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      infoNftDto.playTime = nftEntity.playTime;
      infoNftDto.isLike = false;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.isOnSale = nftEntity.isOnSale;

      if(exchangeObj.length > 0) infoNftDto.price = exchangeObj[0].price;

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }

      const streamObj = await entityManager.query(
        'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
        '( ' +
        'select token_id from showtime_tier where showtime_id = ? ' +
        ')'
        , [Number(nftEntity.playTime), nftEntity.id]);

      infoNftDto.playCount = streamObj[0].totalStreams;


      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);
      infoNftDto.source = 'normal';
      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  /**
   * 음악 리스트 (검색도 있음)
   * 수정해야 하는 것: 기본적으로 정렬을 한 상태로 줄 것임.
   * 이렇게 되면 search 라우터는 따로 만들 필요가 없음.
   *
   * @param keyword
   */
  async findNftList(sortNftDto: SortNftDto): Promise<InfoNftDto[]> {

    const nftList = await getRepository(NftMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
      .leftJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
      .leftJoinAndSelect('mg.genreEntity', 'g')
      .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
      .leftJoinAndSelect('ml.userEntity', 'u')
      .where(typeof sortNftDto.keyword != 'undefined' ? '(m.name like :keyword or m.artist like :keyword)' : '1 = 1', {keyword: `%${sortNftDto.keyword}%`})
      .andWhere(sortNftDto.genreIds.length > 0 ? 'mg.genre_id in (:genreIds)' : '1 = 1', {genreIds: sortNftDto.genreIds})
      .andWhere(typeof sortNftDto.device != 'undefined' && sortNftDto.device == 'ios' && 'm.viewYn = \'Y\' ')
      .orderBy(`m.${sortNftDto.sortType}`, 'DESC')
      .getMany();

    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];

    for(const nftEntity of nftList) {

      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      infoNftDto.playTime = nftEntity.playTime;
      infoNftDto.isLike = false;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.source = nftEntity.source;

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }
      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }

      infoNftDto.genres = genres.substring(0, genres.length-2);


      for(const nftLikeEntity of nftEntity.nftMusicLikeEntity){
        if(nftLikeEntity.userEntity != undefined) {
          if(nftLikeEntity.userEntity.id == parseInt(sortNftDto.userId)) {
            infoNftDto.isLike = true;
          }
        }
      }

      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  /**
   * 한 유저가 좋아요 한 플레이리스트
   * 수정해야 하는 것: 기본적으로 정렬을 한 상태로 줄 것임.
   * 이렇게 되면 search 라우터는 따로 만들 필요가 없음.
   *
   * @param keyword
   */
  async findNftListByUser(findByUserNftDto: FindByUserNftDto): Promise<InfoNftDto[]> {

    const nftList = await getRepository(NftMusicEntity)
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
        .leftJoinAndSelect('mf.fileEntity', 'f')
        .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
        .leftJoinAndSelect('mg.genreEntity', 'g')
        .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
        .where('ml.userEntity = :userId', {userId: findByUserNftDto.targetUserId})
        .andWhere(typeof findByUserNftDto.device != 'undefined' && findByUserNftDto.device == 'ios' && 'm.viewYn = \'Y\' ')
        .orderBy('m.id', 'DESC')
        .getMany();
    const userLikeList = await getRepository(NftMusicEntity)
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
        .leftJoinAndSelect('mf.fileEntity', 'f')
        .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
        .leftJoinAndSelect('mg.genreEntity', 'g')
        .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
        .where('ml.userEntity = :userId', {userId: findByUserNftDto.userId})
        .andWhere(typeof findByUserNftDto.device != 'undefined' && findByUserNftDto.device == 'ios' && 'm.viewYn = \'Y\' ')
        .orderBy('m.id', 'DESC')
        .getMany();
    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];
    for(const nftEntity of nftList) {
      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      infoNftDto.playTime = nftEntity.playTime;
      infoNftDto.isLike = false;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.source = nftEntity.source;

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }

      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);

      // 이게 원조
      // for(const nftLikeEntity of nftEntity.nftMusicLikeEntity){
      //   console.log('타겟',nftEntity.id)
      // }
      // for(const nftEntity of nftList) {
      // nftEntity.id -> 타겟유저가 좋아하는 음악
      let targetNftEntity = nftEntity;
      for(const nftEntity of userLikeList) { //
        // console.log(nftEntity.id==targetNftEntity.id)
        if(nftEntity.id==targetNftEntity.id){
          infoNftDto.isLike = true;
        }

        // if(nftLikeEntity.userEntity != undefined) {
        //   if(nftLikeEntity.userEntity.id == parseInt(sortNftDto.userId)) {
        //     infoNftDto.isLike = true;
        //   }
        // }
      }

      infoNftDtos.push(infoNftDto);
    }

    return infoNftDtos;
  }

  /**
   * 좋아요 음악 리스트 (검색도 있음)
   * @param userId
   * @param keyword
   */
  async findNftLikeList(sortNftDto: SortNftDto): Promise<InfoNftDto[]> {
    const nftList = await getRepository(NftMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.showtimeEntity', 's')
      .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
      .innerJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
      .innerJoinAndSelect('mg.genreEntity', 'g')
      .innerJoinAndSelect('m.nftMusicLikeEntity', 'ml')
      .where('ml.userEntity = :userId', {userId: sortNftDto.userId})
      .andWhere(typeof sortNftDto.keyword != 'undefined' ? '(m.name like :keyword or m.artist like :keyword)' : '1 = 1', {keyword: `%${sortNftDto.keyword}%`})
      .andWhere(typeof sortNftDto.device != 'undefined' && sortNftDto.device == 'ios' && 'm.viewYn = \'Y\' ')

    if(typeof sortNftDto.take != 'undefined') {
      nftList.take(sortNftDto.take);
    }

    const nftListResult = await nftList
      .orderBy('m.id', 'DESC')
      .getMany();

    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];

    for(const nftEntity of nftListResult) {
      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      infoNftDto.playTime = nftEntity.playTime;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.source = nftEntity.source;

      if(infoNftDto.source == 'showtime') {
        infoNftDto.nftMusicId = nftEntity.showtimeEntity.id;
      }

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }

      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }
      infoNftDto.genres = genres.substring(0, genres.length-2);
      if(nftEntity.nftMusicLikeEntity.length == 0) {
        infoNftDto.isLike = false;
      } else {
        infoNftDto.isLike = true;
      }

      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  /**
   * 음악 상세
   * @param id
   */
  async findNftInfo(nftMusicId: number, userId: number): Promise<InfoNftDto> {

    const nftInfo = await getRepository(NftMusicEntity)
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.nftMusicFileEntity', 'nf')
      .leftJoinAndSelect('nf.fileEntity', 'f')
      .leftJoinAndSelect('n.nftMusicGenreEntity', 'ng')
      .leftJoinAndSelect('ng.genreEntity', 'g')
      .leftJoinAndSelect('n.userNftMusicEntity', 'nun')
      .leftJoinAndSelect('nun.userEntity', 'u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'ff')
      .leftJoinAndSelect('n.nftMusicLikeEntity', 'nl')
      .leftJoinAndSelect('nl.userEntity', 'nlu')
      .where('n.id = :nftMusicId', {nftMusicId: nftMusicId})
      .getOne();
    if (!nftInfo) {
      // throw new RuntimeException('Music Not Found');

    }

    const entityManager = getManager();
    const exchangeObj = await entityManager.query(
      'select id as exchangeId, item_id as itemId, price, source from exchange e where nft_music_id = ?'
      , [nftMusicId]);

    const infoNftDto = new InfoNftDto();

    const userObj = await entityManager.query(
      'select ' +
      'u.id, u.handle from nft_music n ' +
      'inner join user u ' +
      'on n.handle = u.handle ' +
      'where n.id = ? and n.source != \'catalog\''
      , [nftMusicId]);

    infoNftDto.nftMusicId = nftInfo.id;
    infoNftDto.title = nftInfo.title;
    infoNftDto.name = nftInfo.name;
    infoNftDto.artist = nftInfo.artist;
    infoNftDto.handle = nftInfo.handle;
    infoNftDto.description = nftInfo.description;
    infoNftDto.lyrics = nftInfo.lyrics;
    infoNftDto.ipfsHash = nftInfo.ipfsHash;
    infoNftDto.tokenId = nftInfo.tokenId;
    infoNftDto.isOnSale = nftInfo.isOnSale;
    infoNftDto.playTime = nftInfo.playTime;
    infoNftDto.minter = nftInfo.minter;
    // infoNftDto.handle = nftInfo.userNftMusicEntity[0].userEntity.handle;
    if(userObj.length > 0) {
      infoNftDto.userId = userObj[0].id;
      infoNftDto.handle = userObj[0].handle;
    }

    infoNftDto.tier = 'normal';
    infoNftDto.rareYn = 'N';
    if(exchangeObj.length > 0) {
      infoNftDto.price = exchangeObj[0].price;
      infoNftDto.itemId = exchangeObj[0].itemId;
      infoNftDto.exchangeId = exchangeObj[0].exchangeId;
      infoNftDto.source = exchangeObj[0].source;
    } else {
      infoNftDto.source = 'normal';
    }

    infoNftDto.artists = [];
    if(nftInfo.source != 'catalog') {
      const userInfo = await getRepository(UserEntity)
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.userFileEntity', 'uf')
        .leftJoinAndSelect('uf.fileEntity', 'ff')
        .where('u.handle = :handle', {handle: nftInfo.handle})
        .getOne();
      if (!userInfo) {
        return new InfoNftDto();
      }

      const userInfoDto = new ResponseUserInfoDto();
      userInfoDto.userId = userInfo.id;
      userInfoDto.handle = userInfo.handle;
      userInfoDto.name = userInfo.nickname
      userInfoDto.address = userInfo.address
      userInfoDto.imgFileUrl = userInfo.userFileEntity.length == 0 ? '' : userInfo.userFileEntity[0].fileEntity.url;

      infoNftDto.artists.push(userInfoDto);
    }

    let fileInfos = [];

    for(const nftFileEntity of nftInfo.nftMusicFileEntity) {
      switch (nftFileEntity.fileType) {
        case 'MUSIC':
          infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
          infoNftDto.musicFileName = nftFileEntity.fileEntity.name;
          break;
        case 'IMAGE':
          infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
          break;
      }
      const infoFileDto = new InfoFileDto();
      infoFileDto.fileId = nftFileEntity.fileEntity.id;
      infoFileDto.filetype = nftFileEntity.fileType;
      fileInfos.push(infoFileDto);
    }

    infoNftDto.files = fileInfos;

    let genres = '';
    let genreIds = [];

    for(const nftGenreEntity of nftInfo.nftMusicGenreEntity) {
      genres += nftGenreEntity.genreEntity.name + ', '
      genreIds.push(nftGenreEntity.genreEntity.id);
    }

    infoNftDto.genres = genres.substring(0, genres.length-2);
    infoNftDto.genreIds = genreIds;

    const nftLikeInfo = await getRepository(NftMusicLikeEntity)
      .createQueryBuilder('nl')
      .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: nftMusicId})
      .andWhere('nl.userEntity = :userId', {userId: userId})
      .getOne()

    if (!nftLikeInfo) {
      infoNftDto.isLike = false;
    } else {
      infoNftDto.isLike = true;
    }

    const streamObj = await entityManager.query(
      'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
      '( ' +
      'select token_id from nft_music where id = ? ' +
      ')'
      , [Number(nftInfo.playTime), nftMusicId]);
    const songInfoDto = new ResponseSongInfoDto();
    songInfoDto.streams = streamObj[0].totalStreams;
    songInfoDto.likes = nftInfo.nftMusicLikeEntity.length;
    songInfoDto.origin = nftInfo.source;
    infoNftDto.songInfo = songInfoDto;

    const nftInfoDto = new ResponseNftInfoDto();
    const coinObj = await entityManager.query(
      'select rate from coin_marketrate where name = \'ethereum\' ');
    let coinToUsd = Number(coinObj[0].rate);

    // infoExchangeDto.price = (Number(exchangeEntity.price) / 10**18).toString();

    nftInfoDto.leftAmount = 1;
    nftInfoDto.totalAmount = 1;
    // if(exchangeObj.length > 0) nftInfoDto.price = exchangeObj[0].price;
    if(exchangeObj.length > 0) nftInfoDto.price = Number((Number(exchangeObj[0].price) / 10 ** 18).toString());
    if(exchangeObj.length > 0) nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(nftInfoDto.price));
    infoNftDto.nftInfo = nftInfoDto;

    const fellazList = new Set<ResponseUserInfoDto>();

    for(const holder of nftInfo.userNftMusicEntity) {
      const fellazInfoDto = new ResponseUserInfoDto();
      fellazInfoDto.userId = holder.userEntity.id;
      fellazInfoDto.handle = holder.userEntity.handle;
      fellazInfoDto.imgFileUrl = holder.userEntity.userFileEntity.length == 0 ? '' : holder.userEntity.userFileEntity[0].fileEntity.url;
      fellazList.add(fellazInfoDto);
    }

    infoNftDto.fellaz = Array.from(fellazList);

    const contractInfoDto = new ResponseContractInfoDto();
    contractInfoDto.releaseDate = Formatter.dateFormatter(nftInfo.createdAt);
    contractInfoDto.address = process.env.MILLIMX_NFT_CONTRACT;
    contractInfoDto.tokenId = nftInfo.tokenId;
    contractInfoDto.tokenStandard = 'ERC721';
    contractInfoDto.blockchain = 'Ethereum';

    // TODO : 현재 일반 민팅시 split 내용을 디비에 저장하지 않고 있음
    // TODO : 나중에 작업해야함
    const splits = [];
    //
    // for(const distributor of nftInfo.) {
    //   const splitStructureDto = new ResponseSplitStructureDto();
    //   splitStructureDto.address = distributor.address;
    //   splitStructureDto.percent = distributor.percent;
    //   splits.push(splitStructureDto);
    // }
    //
    contractInfoDto.splitStructure = splits;
    infoNftDto.contractInfo = contractInfoDto;

    return infoNftDto;
  }

  async findNftToTokenIdAndSource(tokenId: string, source: string, totalSecond: number): Promise<InfoNftDto> {

    const entityManager = getManager();

    let showtimeId;

    if(source == 'showtime') {
      const showtimeObj = await entityManager.query(
        'select showtime_id as showtimeId from showtime_tier where token_id = ? ',
        [tokenId]);

      showtimeId = showtimeObj[0].showtimeId;

      // const tokenObj = await entityManager.query(
      //   'select min(token_id) as tokenId from showtime_tier where showtime_id = ? ',
      //   [showtimeObj[0].showtimeId]);
      //
      // tokenId = tokenObj[0].tokenId;

      return await ShowtimeTierRepository.getL2eToShowtimeId(showtimeId);
    }

    const nftInfo = await getRepository(NftMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
      .leftJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
      .leftJoinAndSelect('mg.genreEntity', 'g')
      .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
      .leftJoinAndSelect('ml.userEntity', 'u')
      .where('m.tokenId = :tokenId', {tokenId: tokenId})
      .andWhere('m.source = :source', {source: source})
      .getOne();

    const infoNftDto = new InfoNftDto();

    if (!nftInfo) {
      throw new RuntimeException('Music Not Found');
      // return await ShowtimeTierRepository.getTierToTokenId(tokenId, totalSecond);
    }


    infoNftDto.nftMusicId = nftInfo.id;
    infoNftDto.title = nftInfo.title;
    infoNftDto.name = nftInfo.name;
    infoNftDto.artist = nftInfo.artist;
    infoNftDto.handle = nftInfo.handle;
    infoNftDto.description = nftInfo.description;
    infoNftDto.lyrics = nftInfo.lyrics;
    infoNftDto.playCount = Math.ceil(totalSecond / nftInfo.playTime);
    infoNftDto.playTime = nftInfo.playTime;
    infoNftDto.isLike = false;
    infoNftDto.tokenId = nftInfo.tokenId;
    infoNftDto.source = nftInfo.source;

    if(nftInfo.source == 'showtime') {
      infoNftDto.showtimeId = showtimeId;
    }

    for(const nftFileEntity of nftInfo.nftMusicFileEntity) {
      switch (nftFileEntity.fileType) {
        case 'MUSIC':
          infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
          break;
        case 'IMAGE':
          infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
          break;
      }
    }
    let genres = '';
    for(const nftGenreEntity of nftInfo.nftMusicGenreEntity) {
      genres += nftGenreEntity.genreEntity.name + ', '
    }

    infoNftDto.genres = genres.substring(0, genres.length-2);

    return infoNftDto;
  }

  async patchPlayCount(nftMusicId: number) {
    const infoNftDto = await this.findOne(nftMusicId);
    // const infoNftDto = await this.findOneById(nftMusicId);

    // await this.update({ id: nftMusicId }, {
    //   playCount: Number(infoNftDto.playCount) + 1,
    // });

    await getConnection()
      .createQueryBuilder()
      .update(NftMusicEntity)
      .set({
        playCount: Number(infoNftDto.playCount) + 1,
      })
      .where('id = :nftMusicId', {nftMusicId: nftMusicId})
      .execute();
  }

  async patchOnSale(nftMusicId: number, isOnSale: string) {
    // await this.update({ id: nftMusicId }, {
    //   isOnSale: isOnSale,
    // });

    await getConnection()
      .createQueryBuilder()
      .update(NftMusicEntity)
      .set({
        isOnSale: isOnSale,
      })
      .where('id = :nftMusicId', {nftMusicId: nftMusicId})
      .execute();
  }

  async findNftListTake(take: number): Promise<InfoNftDto[]> {

    const nftList = await getRepository(NftMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
      .leftJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
      .leftJoinAndSelect('mg.genreEntity', 'g')
      .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
      .leftJoinAndSelect('m.showtimeEntity', 's')
      .orderBy(`m.createdAt`, 'DESC')
      .take(take)
      .getMany();

    if (!nftList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoNftDtos = [];
    const entityManager = getManager();

    for(const nftEntity of nftList) {

      const infoNftDto = new InfoNftDto();

      infoNftDto.nftMusicId = nftEntity.id;
      infoNftDto.title = nftEntity.title;
      infoNftDto.name = nftEntity.name;
      infoNftDto.artist = nftEntity.artist;
      infoNftDto.handle = nftEntity.handle;
      infoNftDto.description = nftEntity.description;
      infoNftDto.lyrics = nftEntity.lyrics;
      // infoNftDto.playTime = nftEntity.playTime;

      if(nftEntity.source == 'showtime') {
        const streamObj = await entityManager.query(
          'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
          '( ' +
          'select token_id from showtime_tier where showtime_id = ? ' +
          ')'
          , [Number(nftEntity.playTime), nftEntity.showtimeEntity.id]);
        infoNftDto.playCount = streamObj[0].totalStreams;
      } else {
        const streamObj = await entityManager.query(
          'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
          '( ' +
          'select token_id from nft_music where id = ? ' +
          ')'
          , [nftEntity.playTime, nftEntity.id]);
        infoNftDto.playCount = streamObj[0].totalStreams;
      }


      infoNftDto.isLike = false;
      infoNftDto.tokenId = nftEntity.tokenId;
      infoNftDto.source = nftEntity.source;

      if(infoNftDto.source == 'showtime') {
        const showtimeObj = await entityManager.query(
          'select showtime_id as showtimeId from showtime_tier where token_id = ? ',
          [nftEntity.tokenId]);
        infoNftDto.showtimeId = showtimeObj[0].showtimeId;
      }

      for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
        switch (nftFileEntity.fileType) {
          case 'MUSIC':
            infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
            break;
        }
      }
      let genres = '';
      for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
        genres += nftGenreEntity.genreEntity.name + ', '
      }

      infoNftDto.genres = genres.substring(0, genres.length-2);

      infoNftDtos.push(infoNftDto);
    }
    return infoNftDtos;
  }

  async getLandingNft(nftMusicId: number): Promise<ResponseRecentWebDto> {

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
      .where('n.id = :nftMusicId', {nftMusicId: nftMusicId})
      .getOne();
    if (!nftInfo) {
      return new ResponseRecentWebDto();
    }

    const responseRecentWebDto = new ResponseRecentWebDto();
    responseRecentWebDto.nftMusicId = Number(nftInfo.id);
    responseRecentWebDto.name = nftInfo.name;
    responseRecentWebDto.artist = nftInfo.artist;
    responseRecentWebDto.title = nftInfo.title;
    responseRecentWebDto.description = nftInfo.description;
    responseRecentWebDto.lyrics = nftInfo.lyrics;
    responseRecentWebDto.releaseYn = 'Y';

    for(const file of nftInfo.nftMusicFileEntity) {
      if(file.fileType == 'IMAGE') {
        responseRecentWebDto.imgFileUrl = file.fileEntity.url;
      } else if(file.fileType == 'MUSIC') {
        responseRecentWebDto.musicFileUrl = file.fileEntity.url;
      }
    }

    responseRecentWebDto.artists = [];


    if(nftInfo.source != 'catalog') {
      const userInfo = await getRepository(UserEntity)
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.userFileEntity', 'uf')
        .leftJoinAndSelect('uf.fileEntity', 'ff')
        .where('u.handle = :handle', {handle: nftInfo.handle})
        .getOne();
      if (!userInfo) {
        return new ResponseRecentWebDto();
      }

      const userInfoDto = new ResponseUserInfoDto();
      userInfoDto.userId = userInfo.id;
      userInfoDto.handle = userInfo.handle;
      userInfoDto.name = userInfo.nickname
      userInfoDto.address = userInfo.address
      userInfoDto.imgFileUrl = userInfo.userFileEntity.length == 0 ? '' : userInfo.userFileEntity[0].fileEntity.url;

      responseRecentWebDto.artists.push(userInfoDto);
    }

    const entityManager = getManager();
    const streamObj = await entityManager.query(
      'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
      '( ' +
      'select token_id from nft_music where id = ? ' +
      ')'
      , [Number(nftInfo.playTime), nftMusicId]);
    const songInfoDto = new ResponseSongInfoDto();
    songInfoDto.streams = streamObj[0].totalStreams;
    songInfoDto.likes = nftInfo.nftMusicLikeEntity.length;
    songInfoDto.origin = nftInfo.source;
    responseRecentWebDto.songInfo = songInfoDto;

    const exchangeObj = await entityManager.query(
      'select price from exchange e where token_id = ?'
      , [nftInfo.tokenId]);

    const nftInfoDto = new ResponseNftInfoDto();
    const coinObj = await entityManager.query(
      'select rate from coin_marketrate where name = \'ethereum\' ');
    let coinToUsd = Number(coinObj[0].rate);

    // infoExchangeDto.price = (Number(exchangeEntity.price) / 10**18).toString();

    nftInfoDto.leftAmount = 1;
    nftInfoDto.totalAmount = 1;
    // if(exchangeObj.length > 0) nftInfoDto.price = exchangeObj[0].price;
    if(exchangeObj.length > 0) nftInfoDto.price = Number((Number(exchangeObj[0].price) / 10 ** 18).toString());
    if(exchangeObj.length > 0) nftInfoDto.cnutAmount = Math.ceil(coinToUsd * 10 * Number(nftInfoDto.price));
    responseRecentWebDto.nftInfo = nftInfoDto;

    const fellazList = new Set<ResponseUserInfoDto>();

    for(const holder of nftInfo.userNftMusicEntity) {
      const fellazInfoDto = new ResponseUserInfoDto();
      fellazInfoDto.userId = holder.userEntity.id;
      fellazInfoDto.handle = holder.userEntity.handle;
      fellazInfoDto.imgFileUrl = holder.userEntity.userFileEntity.length == 0 ? '' : holder.userEntity.userFileEntity[0].fileEntity.url;
      fellazList.add(fellazInfoDto);
    }

    responseRecentWebDto.fellaz = Array.from(fellazList);

    const contractInfoDto = new ResponseContractInfoDto();
    contractInfoDto.releaseDate = Formatter.dateFormatter(nftInfo.createdAt);
    contractInfoDto.address = process.env.MILLIMX_NFT_CONTRACT;
    contractInfoDto.tokenId = nftInfo.tokenId;
    contractInfoDto.tokenStandard = 'ERC721';
    contractInfoDto.blockchain = 'Ethereum';

    // TODO : 현재 일반 민팅시 split 내용을 디비에 저장하지 않고 있음
    // TODO : 나중에 작업해야함
    const splits = [];
    //
    // for(const distributor of nftInfo.) {
    //   const splitStructureDto = new ResponseSplitStructureDto();
    //   splitStructureDto.address = distributor.address;
    //   splitStructureDto.percent = distributor.percent;
    //   splits.push(splitStructureDto);
    // }
    //
    contractInfoDto.splitStructure = splits;
    responseRecentWebDto.contractInfo = contractInfoDto;

    return responseRecentWebDto;
  }
}

