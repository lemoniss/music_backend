import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateExchangeDto } from "../dto/create.exchange.dto";
import { InfoExchangeDto } from "../dto/info.exchange.dto";
import { ExchangeEntity } from "../entity/exchange.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { SearchExchangeDto } from "../dto/search.exchange.dto";
import { NftMusicLikeEntity } from "../../nftmusic/entity/nftmusic_like.entity";
import { UserEntity } from "../../user/entity/user.entity";

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
      infoExchangeDto.price = exchangeEntity.price;
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
  async findExchangeInfo(exchangeId: number, address: string): Promise<InfoExchangeDto> {

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
    infoExchangeDto.price = exchangeInfo.price;
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

    const nftObj = await entityManager.query(
      'select ' +
      'n.play_count as playCount, ' +
      '(select count(*) from nft_music_like where nft_music_id = n.id) as likeCount, ' +
      'ifnull(n.showtime_id, 0) as showTimeId ' +
      'from nft_music n where id = ?'
      , [exchangeInfo.nftMusicId]);

    if(nftObj.length > 0) {
      infoExchangeDto.playCount = Number(nftObj[0].playCount);
      infoExchangeDto.likeCount = Number(nftObj[0].likeCount);
      infoExchangeDto.showTimeId = Number(nftObj[0].showTimeId);
    } else {
      infoExchangeDto.showTimeId = 0;
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

    const nftLikeInfo = await getRepository(NftMusicLikeEntity)
      .createQueryBuilder('nl')
      .leftJoinAndSelect('nl.userEntity', 'u')
      .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: exchangeInfo.nftMusicId})
      .andWhere('u.address = :address', {address: address})
      .getOne()

    if (!nftLikeInfo) {
      infoExchangeDto.isLike = false;
    } else {
      infoExchangeDto.isLike = true;
    }

    console.log(typeof infoExchangeDto.userId)
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
