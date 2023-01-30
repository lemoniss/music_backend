import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { CreateUserDto } from "../dto/create.user.dto";
import { UpdateUserDto } from "../dto/update.user.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { InfoUserDto } from "../dto/info.user.dto";
import { UserSnsDto } from "../dto/UserSnsDto";
import { ResponseArtistDto } from "../../showtime/dto/response.artist.dto";
import { ShowtimeCrewEntity } from "../../showtime/entity/showtime_crew.entity";
import { UserFileEntity } from "../entity/user_file.entity";
import { UserShowtimeEntity } from "../../showtime/entity/user_showtime.entity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

  /**
   * 사용자 정보 생성
   * @param createUserDto
   */
  async createUser(createUserDto: CreateUserDto): Promise<number> {
    try {
      // const user = await this.save({
      //   address: createUserDto.address,
      //   nickname: 'NONAME',
      //   introduce: '',
      //   handle: createUserDto.handle,
      //   lang: createUserDto.lang,
      //   nation: createUserDto.nation,
      //   device: typeof createUserDto.device == 'undefined' || createUserDto.device == '' ? 'android' : createUserDto.device,
      // });

      const user = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({
          address: createUserDto.address,
          nickname: 'NONAME',
          introduce: '',
          handle: createUserDto.handle,
          lang: createUserDto.lang,
          nation: createUserDto.nation,
          device: typeof createUserDto.device == 'undefined' || createUserDto.device == '' ? 'android' : createUserDto.device,
        })
        .execute();

      return user.raw.insertId;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 사용자 정보 수정
   * @param updateUserDto
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {

      const infoUserDto = await this.findById(id);
      const userHandle = updateUserDto.handle.replace('@', '')
      const beforeHandle = infoUserDto.handle;
      // await this.update({ id: id }, {
      //   nickname: updateUserDto.nickname == '' || typeof updateUserDto.nickname == 'undefined' ? infoUserDto.nickname : updateUserDto.nickname,
      //   introduce: updateUserDto.introduce == '' || typeof updateUserDto.introduce == 'undefined' ? infoUserDto.introduce : updateUserDto.introduce,
      //   handle: userHandle == '' || typeof userHandle == 'undefined' ? beforeHandle : userHandle,
      // });

      await getConnection()
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          nickname: updateUserDto.nickname == '' || typeof updateUserDto.nickname == 'undefined' ? infoUserDto.nickname : updateUserDto.nickname,
          introduce: updateUserDto.introduce == '' || typeof updateUserDto.introduce == 'undefined' ? infoUserDto.introduce : updateUserDto.introduce,
          handle: userHandle == '' || typeof userHandle == 'undefined' ? beforeHandle : userHandle,
        })
        .where('id = :id', {id: id})
        .execute();

      if(userHandle != '' && typeof userHandle != 'undefined') {
        const entityManager = getManager();
        await entityManager.query(
          'update ' +
          'my_music ' +
          'set handle = ? ' +
          'where handle = ?'
          , [userHandle, beforeHandle]);

        await entityManager.query(
          'update ' +
          'nft_music ' +
          'set handle = ? ' +
          'where handle = ?'
          , [userHandle, beforeHandle]);

        await entityManager.query(
          'update ' +
          'exchange ' +
          'set handle = ? ' +
          'where handle = ?'
          , [userHandle, beforeHandle]);

        await entityManager.query(
          'update ' +
          'showtime ' +
          'set handle = ? ' +
          'where handle = ?'
          , [userHandle, beforeHandle]);
      }

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async findById(id: number): Promise<InfoUserDto> {
    const userEntity = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .leftJoinAndSelect('u.userGenreEntity', 'ug')
      .leftJoinAndSelect('ug.genreEntity', 'g')
      .leftJoinAndSelect('u.userSnsEntity', 'us')
      .where('u.id = :id', {id: id})
      .getOne();

    if (!userEntity) {
      throw new RuntimeException('User Not Found');
    }

    const infoUserDto = new InfoUserDto();
    infoUserDto.id = userEntity.id;
    infoUserDto.address = userEntity.address;
    infoUserDto.nickname = userEntity.nickname;
    infoUserDto.handle = userEntity.handle;
    infoUserDto.introduce = userEntity.introduce;
    infoUserDto.profileImgUrl = typeof userEntity.userFileEntity == 'undefined' || userEntity.userFileEntity.length == 0 ? '' : userEntity.userFileEntity[0].fileEntity.url;
    infoUserDto.createAt = this.dateFormatter(userEntity.createdAt);
    // responseArtistDto.createAt = this.dateFormatter(artistInfo.createdAt);
    let genres = '';
    let genreIds = [];

    for(const userGenreEntity of userEntity.userGenreEntity) {
      genres += userGenreEntity.genreEntity.name + ', '
      genreIds.push(userGenreEntity.genreEntity.id);
    }

    infoUserDto.genres = genres.substring(0, genres.length-2);
    infoUserDto.genreIds = genreIds;

    infoUserDto.userSns = [];

    for(const userSnsEntity of userEntity.userSnsEntity) {
      const userSnsDto = new UserSnsDto();
      userSnsDto.name = userSnsEntity.name;
      userSnsDto.snsHandle = userSnsEntity.snsHandle;
      infoUserDto.userSns.push(userSnsDto);
    }

    return infoUserDto;
  }

  // 최초 사용자데이터 존재여부 검색시 사용
  async findByAddress(address: string): Promise<InfoUserDto> {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.address = :address', {address: address})
      .getOne();

    const infoUserDto = new InfoUserDto();

    if(!user) {
      // throw new NotFoundException('User Not Found');
      infoUserDto.id = 0;
    } else {
      infoUserDto.id = user.id;
      infoUserDto.address = user.address;
      infoUserDto.nickname = user.nickname;
      infoUserDto.handle = user.handle;
      infoUserDto.introduce = user.introduce;
      infoUserDto.profileImgUrl = typeof user.userFileEntity == 'undefined' || user.userFileEntity.length == 0 ? '' : user.userFileEntity[0].fileEntity.url;
    }
    return infoUserDto;
  }

  // 최초 사용자데이터 존재여부 검색시 사용
  async findByHandle(handle: string): Promise<InfoUserDto> {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.handle = :handle', {handle: handle})
      .getOne();

    const infoUserDto = new InfoUserDto();

    if(!user) {
      // throw new NotFoundException('User Not Found');
      infoUserDto.id = 0;
    } else {
      infoUserDto.id = user.id;
      infoUserDto.address = user.address;
      infoUserDto.nickname = user.nickname;
      infoUserDto.handle = user.handle;
      infoUserDto.introduce = user.introduce;
      infoUserDto.profileImgUrl = typeof user.userFileEntity == 'undefined' || user.userFileEntity.length == 0 ? '' : user.userFileEntity[0].fileEntity.url;
    }
    return infoUserDto;
  }

  // header 검증용. 결과없으면 여기서 짤라버림
  async findByIdAndAddress(id:number, address: string): Promise<UserEntity> {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', {id: id})
      .andWhere('user.address = :address', {address: address})
      .getOne();

    // if(!user)
    //   throw new NotFoundException('User Not Found');

    return user;
  }

  // handle 검색용
  async isExistHandle(handle: string): Promise<boolean> {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.handle = :handle', {handle: handle})
      .getOne();

    if(!user) {
      return true;
    } else {
      return false;
    }
  }

  dateFormatter(pureDate) {
    function pad(n) { return n<10 ? "0"+n : n }
    return pureDate.getFullYear()+"-"+
        pad(pureDate.getMonth()+1)+"-"+
        pad(pureDate.getDate())+" "+
        pad(pureDate.getHours())+":"+
        pad(pureDate.getMinutes())+":"+
        pad(pureDate.getSeconds());
  }

  async getArtists(skip: number) : Promise<ResponseArtistDto[]> {
    const artistList = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.userArtistEntity', 'ua')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .leftJoinAndSelect('u.userGenreEntity', 'ug')
      .leftJoinAndSelect('ug.genreEntity', 'g')
      .orderBy('ua.order', 'ASC')
      .take(20)
      .skip(skip)
      .getManyAndCount();

    const response = [];

    artistList[1]

    if (!artistList) {
      return response;
    }

    for(const artistInfo of artistList[0]) {
      const responseArtistDto = new ResponseArtistDto();
      responseArtistDto.artistId = artistInfo.id;
      responseArtistDto.artistImage = artistInfo.userFileEntity.length == 0 ? '' : artistInfo.userFileEntity[0].fileEntity.url;
      responseArtistDto.nickname = artistInfo.nickname;
      responseArtistDto.handle = artistInfo.handle;
      responseArtistDto.address = artistInfo.address;
      responseArtistDto.createAt = this.dateFormatter(artistInfo.createdAt);
      responseArtistDto.isFollower = false;
      responseArtistDto.genres = [];
      responseArtistDto.isComingsoon = artistInfo.userArtistEntity[0].isComingsoon == 'Y' ? true : false;
      for(const genre of artistInfo.userGenreEntity) {
        responseArtistDto.genres.push(genre.genreEntity.name);
      }
      responseArtistDto.introduce = artistInfo.introduce;
      responseArtistDto.remainCount = artistList[1] - skip;

      response.push(responseArtistDto);
    }
    return response;
  }

  // paging(param: ArticleSearchRequest): Promise<[Article[], number]>{
  //   const queryBuilder = createQueryBuilder()
  //     .select([
  //       "article.id",
  //       "article.reservationDate",
  //       "article.title",
  //       "article.content"
  //     ])
  //     .from(Article, "article")
  //     .limit(param.getLimit())
  //     .offset(param.getOffset());
  //
  //   if(param.hasReservationDate()) {
  //     queryBuilder.andWhere("article.reservationDate >= :reservationDate", {reservationDate: param.reservationDate})
  //   }
  //
  //   if(param.hasTitle()) {
  //     queryBuilder.andWhere("article.title ilike :title", {title: `%${param.title}%`});
  //   }
  //
  //   return queryBuilder
  //     .disableEscaping()
  //     .getManyAndCount();
  // }
}
