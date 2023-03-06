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
import { Formatter } from "../../util/formatter";
import { SortNftDto } from "../../nftmusic/dto/sort.nft.dto";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

  /**
   * 사용자 정보 생성
   * @param createUserDto
   */
  async createUser(createUserDto: CreateUserDto) {
    try {
      await getConnection()
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
      .leftJoinAndSelect('u.userFollowerEntity', 'ufw')
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
    for(const userFile of userEntity.userFileEntity) {
      if(userFile.fileType == 'PROFILE') {
        infoUserDto.profileImgUrl = userFile.fileEntity.url;
      } else if(userFile.fileType == 'BANNER') {
        infoUserDto.bannerImgUrl = userFile.fileEntity.url;
      } else {
        infoUserDto.profileImgUrl = '';
      }
    }
    infoUserDto.createAt = Formatter.dateFormatter(userEntity.createdAt);
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

    infoUserDto.isFollowing = false;
    infoUserDto.followerCount = 0;
    infoUserDto.followingCount = 0;

    return infoUserDto;
  }

  async findByUserIdAndArtistId(userId: number, artistId: number): Promise<InfoUserDto> {
    const userEntity = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .leftJoinAndSelect('u.userGenreEntity', 'ug')
      .leftJoinAndSelect('ug.genreEntity', 'g')
      .leftJoinAndSelect('u.userSnsEntity', 'us')
      .leftJoinAndSelect('u.userFollowerEntity', 'ufw')
      .where('u.id = :artistId', {artistId: artistId})
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
    for(const userFile of userEntity.userFileEntity) {
      if(userFile.fileType == 'PROFILE') {
        infoUserDto.profileImgUrl = userFile.fileEntity.url;
      } else if(userFile.fileType == 'BANNER') {
        infoUserDto.bannerImgUrl = userFile.fileEntity.url;
      } else {
        infoUserDto.profileImgUrl = '';
      }
    }
    infoUserDto.createAt = Formatter.dateFormatter(userEntity.createdAt);
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

    infoUserDto.isFollowing = false;
    infoUserDto.followerCount = 0;
    infoUserDto.followingCount = 0;

    for(const follow of userEntity.userFollowerEntity) {
      if(follow.userEntity.id == userId) {
        infoUserDto.isFollowing = true;
      }
      if(follow.userEntity.id == artistId) {
        infoUserDto.followingCount++;
      }
      if(follow.followerEntity.id == artistId) {
        infoUserDto.followerCount++;
      }
    }

    return infoUserDto;
  }

  // 최초 사용자데이터 존재여부 검색시 사용
  async findByAddress(address: string): Promise<InfoUserDto> {

    const user = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .where('u.address = :address', {address: address})
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
      for(const userFile of user.userFileEntity) {
        if(userFile.fileType == 'PROFILE') {
          infoUserDto.profileImgUrl = userFile.fileEntity.url;
        } else if(userFile.fileType == 'BANNER') {
          infoUserDto.bannerImgUrl = userFile.fileEntity.url;
        } else {
          infoUserDto.profileImgUrl = 'noImage';
        }
      }
    }
    return infoUserDto;
  }

  // 최초 사용자데이터 존재여부 검색시 사용
  async findByHandle(handle: string): Promise<InfoUserDto> {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .where('u.handle = :handle', {handle: handle})
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
      for(const userFile of user.userFileEntity) {
        if(userFile.fileType == 'PROFILE') {
          infoUserDto.profileImgUrl = userFile.fileEntity.url;
        } else if(userFile.fileType == 'BANNER') {
          infoUserDto.bannerImgUrl = userFile.fileEntity.url;
        } else {
          infoUserDto.profileImgUrl = '';
        }
      }
    }
    return infoUserDto;
  }

  findMyInfo

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

  async getArtists(sortNftDto: SortNftDto) : Promise<ResponseArtistDto[]> {
    const artistQuery = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.userArtistEntity', 'ua')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .leftJoinAndSelect('u.userGenreEntity', 'ug')
      .leftJoinAndSelect('ug.genreEntity', 'g')
      .where(typeof sortNftDto.keyword != 'undefined' ? '(u.nickname like :keyword or u.handle like :keyword)' : '1 = 1', {keyword: `%${sortNftDto.keyword}%`})

    if(typeof sortNftDto.take != 'undefined') {
      artistQuery.take(sortNftDto.take);
    }

    if(typeof sortNftDto.skip != 'undefined') {
      artistQuery.skip(sortNftDto.skip);
    }

    const artistList = await artistQuery
      .orderBy('ua.order', 'ASC')
      .getMany();

    const response = [];

    if (!artistList) {
      return response;
    }

    for(const artistInfo of artistList) {
      const responseArtistDto = new ResponseArtistDto();
      responseArtistDto.artistId = artistInfo.id;
      for(const userFile of artistInfo.userFileEntity) {
        if(userFile.fileType == 'PROFILE') {
          responseArtistDto.artistImage = userFile.fileEntity.url;
        } else if(userFile.fileType == 'BANNER') {
          responseArtistDto.artistBannerImage = userFile.fileEntity.url;
        } else {
          responseArtistDto.artistImage = '';
        }
      }
      responseArtistDto.nickname = artistInfo.nickname;
      responseArtistDto.handle = artistInfo.handle;
      responseArtistDto.address = artistInfo.address;
      responseArtistDto.createAt = Formatter.dateFormatter(artistInfo.createdAt);
      responseArtistDto.isFollower = false;
      responseArtistDto.genres = [];
      responseArtistDto.isComingsoon = artistInfo.userArtistEntity[0].isComingsoon == 'Y' ? true : false;
      for(const genre of artistInfo.userGenreEntity) {
        responseArtistDto.genres.push(genre.genreEntity.name);
      }
      responseArtistDto.introduce = artistInfo.introduce;

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
