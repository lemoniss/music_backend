import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { PurchaseShowtimeDto } from "../dto/purchase.showtime.dto";
import { ShowtimeHolderEntity } from "../entity/showtime_holder.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { InfoFileDto } from "../../mymusic/dto/info.file.dto";
import { NftMusicLikeEntity } from "../../nftmusic/entity/nftmusic_like.entity";

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
      infoNftDto.isLike = false;
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
      infoNftDto.isLike = false;
      infoNftDto.tokenId = holderEntity.showtimeTierEntity.tokenId;
      infoNftDto.isOnSale = holderEntity.isOnSale;
      // infoNftDto.price = holderEntity.showtimeTierEntity.price;
      infoNftDto.rareYn = holderEntity.showtimeTierEntity.rareYn;
      infoNftDto.tier = holderEntity.showtimeTierEntity.tier;
      infoNftDto.rareImgFileUrl = [];

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
      .leftJoinAndSelect('sh.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'f')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
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
