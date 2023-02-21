import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { MyMusicEntity } from "../entity/mymusic.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateMusicDto } from "../dto/create.music.dto";
import { UserEntity } from "../../user/entity/user.entity";
import { InfoMusicDto } from "../dto/info.music.dto";
import { UpdateMusicDto } from "../dto/update.music.dto";
import { InfoFileDto } from "../dto/info.file.dto";
import { UpdateMusicStatusDto } from "../dto/status.music.dto";
import { NftMusicEntity } from "../../showtime/entity/nftmusic.entity";

@EntityRepository(MyMusicEntity)
export class MyMusicRepository extends Repository<MyMusicEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  async createMusic(userId: number, createMusicDto: CreateMusicDto): Promise<number> {
    try {
      const userEntity = new UserEntity();
      userEntity.id = userId;

      // const myMusic = await this.save({
      //   title: createMusicDto.title,
      //   name: createMusicDto.name,
      //   artist: createMusicDto.artist,
      //   handle: createMusicDto.handle,
      //   description: createMusicDto.description,
      //   viewYn: 'Y',
      //   userEntity: userEntity,
      //   playTime: Number(createMusicDto.playTime),
      //   lyrics: typeof createMusicDto.lyrics == 'undefined' || createMusicDto.lyrics == '' ? null : createMusicDto.lyrics,
      //   status: 'Review',
      // });
      // return myMusic.id;

      const myMusic = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(MyMusicEntity)
        .values({
          title: createMusicDto.title,
          name: createMusicDto.name,
          artist: createMusicDto.artist,
          handle: createMusicDto.handle,
          description: createMusicDto.description,
          viewYn: 'Y',
          userEntity: userEntity,
          playTime: Number(createMusicDto.playTime),
          lyrics: typeof createMusicDto.lyrics == 'undefined' || createMusicDto.lyrics == '' ? null : createMusicDto.lyrics,
          status: 'Review',
        })
        .execute();

      return myMusic.raw.insertId;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악 정보 수정
   * @param updateUserDto
   */
  async updateMusic(myMusicId: number, updateMusicDto: UpdateMusicDto): Promise<boolean> {
    try {
      const infoMyMusicDto = await this.findOne(myMusicId);

      // await this.update({ id: myMusicId }, {
      //   title: typeof updateMusicDto.title == 'undefined' ? infoMyMusicDto.title : updateMusicDto.title,
      //   name: typeof updateMusicDto.name == 'undefined' ? infoMyMusicDto.name : updateMusicDto.name,
      //   artist: typeof updateMusicDto.artist == 'undefined' ? infoMyMusicDto.title : updateMusicDto.artist,
      //   description: typeof updateMusicDto.description == 'undefined' ? infoMyMusicDto.description : updateMusicDto.description,
      //   lyrics: typeof updateMusicDto.lyrics == 'undefined' ? infoMyMusicDto.lyrics : updateMusicDto.lyrics,
      // });

      await getConnection()
        .createQueryBuilder()
        .update(MyMusicEntity)
        .set({
          title: typeof updateMusicDto.title == 'undefined' ? infoMyMusicDto.title : updateMusicDto.title,
          name: typeof updateMusicDto.name == 'undefined' ? infoMyMusicDto.name : updateMusicDto.name,
          artist: typeof updateMusicDto.artist == 'undefined' ? infoMyMusicDto.title : updateMusicDto.artist,
          description: typeof updateMusicDto.description == 'undefined' ? infoMyMusicDto.description : updateMusicDto.description,
          lyrics: typeof updateMusicDto.lyrics == 'undefined' ? infoMyMusicDto.lyrics : updateMusicDto.lyrics,
          playTime: typeof updateMusicDto.playTime == 'undefined' ? infoMyMusicDto.playTime : Number(updateMusicDto.playTime),
        })
        .where('id = :myMusicId', {myMusicId: myMusicId})
        .execute();

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악 리스트 (검색도 있음)
   * @param id
   */
  async findMusicList(userId: number, keyword: string): Promise<InfoMusicDto[]> {

    const musicList = await getRepository(MyMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.myMusicFileEntity', 'mf')
      .innerJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.myMusicGenreEntity', 'mg')
      .innerJoinAndSelect('mg.genreEntity', 'g')
      .where('m.userEntity = :userId', {userId: userId})
      .andWhere(typeof keyword != 'undefined' ? '(m.name like :keyword or m.artist like :keyword)' : '1 = 1', {keyword: `%${keyword}%`})
      .orderBy('m.id', 'DESC')
      .addOrderBy('mg.genre_id', 'ASC')
      .getMany();
    if (!musicList) {
      throw new RuntimeException('Music Not Found');
    }
    const infoMusicDtos = [];

    for(const musicEntity of musicList) {
      const infoMusicDto = new InfoMusicDto();

      infoMusicDto.myMusicId = musicEntity.id;
      infoMusicDto.title = musicEntity.title;
      infoMusicDto.name = musicEntity.name;
      infoMusicDto.artist = musicEntity.artist;
      infoMusicDto.handle = musicEntity.handle;
      infoMusicDto.description = musicEntity.description;
      infoMusicDto.lyrics = musicEntity.lyrics;
      infoMusicDto.playTime = musicEntity.playTime;
      infoMusicDto.status = musicEntity.status;

      for(const musicFileEntity of musicEntity.myMusicFileEntity) {
        switch (musicFileEntity.fileType) {
          case 'MUSIC':
            infoMusicDto.musicFileUrl = musicFileEntity.fileEntity.url;
            break;
          case 'IMAGE':
            infoMusicDto.imgFileUrl = musicFileEntity.fileEntity.url;
            break;
        }
      }

      let genres = '';
      let genreIds = [];

      for(const musicGenreEntity of musicEntity.myMusicGenreEntity) {
        genres += musicGenreEntity.genreEntity.name + ', '
        genreIds.push(musicGenreEntity.genreEntity.id);
      }

      infoMusicDto.genres = genres.substring(0, genres.length-2);
      infoMusicDto.genreIds = genreIds;
      infoMusicDtos.push(infoMusicDto);
    }
    return infoMusicDtos;
  }

  /**
   * 음악 상세
   * @param id
   */
  async findMusicInfo(myMusicId: number): Promise<InfoMusicDto> {

    const musicInfo = await getRepository(MyMusicEntity)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.myMusicFileEntity', 'mf')
      .innerJoinAndSelect('mf.fileEntity', 'f')
      .leftJoinAndSelect('m.myMusicGenreEntity', 'mg')
      .innerJoinAndSelect('mg.genreEntity', 'g')
      .where('m.id = :myMusicId', {myMusicId: myMusicId})
      .getOne();
    if (!musicInfo) {
      throw new RuntimeException('Music Not Found');
    }

    const infoMusicDto = new InfoMusicDto();

    infoMusicDto.myMusicId = musicInfo.id;
    infoMusicDto.title = musicInfo.title;
    infoMusicDto.name = musicInfo.name;
    infoMusicDto.artist = musicInfo.artist;
    infoMusicDto.handle = musicInfo.handle;
    infoMusicDto.description = musicInfo.description;
    infoMusicDto.playTime = musicInfo.playTime;
    infoMusicDto.lyrics = musicInfo.lyrics;
    infoMusicDto.status = musicInfo.status;

    let fileInfos = [];

    for(const musicFileEntity of musicInfo.myMusicFileEntity) {
      switch (musicFileEntity.fileType) {
        case 'MUSIC':
          infoMusicDto.musicFileUrl = musicFileEntity.fileEntity.url;
          infoMusicDto.musicFileName = musicFileEntity.fileEntity.name;
          break;
        case 'IMAGE':
          infoMusicDto.imgFileUrl = musicFileEntity.fileEntity.url;
          break;
      }
      const infoFileDto = new InfoFileDto();
      infoFileDto.fileId = musicFileEntity.fileEntity.id;
      infoFileDto.filetype = musicFileEntity.fileType;
      fileInfos.push(infoFileDto);
    }

    infoMusicDto.files = fileInfos;

    let genres = '';
    let genreIds = [];

    for(const musicGenreEntity of musicInfo.myMusicGenreEntity) {
      genres += musicGenreEntity.genreEntity.name + ', '
      genreIds.push(musicGenreEntity.genreEntity.id);
    }

    infoMusicDto.genres = genres.substring(0, genres.length-2);
    infoMusicDto.genreIds = genreIds;

    return infoMusicDto;
  }

  /**
   * 음악삭제
   */
  async deleteMusic(myMusicId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MyMusicEntity)
        .where('id = :myMusicId', {myMusicId: myMusicId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악 상태 정보 수정 (승인 or 반려)
   * @param updateUserDto
   */
  async updateMusicStatus(myMusicId: number, updateMusicStatusDto: UpdateMusicStatusDto): Promise<boolean> {
    try {

      // await this.update({ id: myMusicId }, {
      //   status: updateMusicStatusDto.status,
      // });

      await getConnection()
        .createQueryBuilder()
        .update(MyMusicEntity)
        .set({
          status: updateMusicStatusDto.status,
        })
        .where('id = :myMusicId', {myMusicId: myMusicId})
        .execute();

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
