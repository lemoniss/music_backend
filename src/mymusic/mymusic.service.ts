import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { MyMusicRepository } from "./repository/mymusic.repository";
import { MyMusicGenreRepository } from "./repository/mymusic_genre.repository";
import { MyMusicFileRepository } from "./repository/mymusic_file.repository";
import { CreateMusicDto } from "./dto/create.music.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UpdateMusicDto } from "./dto/update.music.dto";
import { InfoMusicDto } from "./dto/info.music.dto";
import { UpdateMusicStatusDto } from "./dto/status.music.dto";
import { MyMusicFileEntity } from "./entity/mymusic_file.entity";
import { MyMusicGenreEntity } from "./entity/mymusic_genre.entity";
import { MyMusicEntity } from "./entity/mymusic.entity";
import { Rsa } from "../util/rsa";
import { UserRepository } from "../user/repository/user.repository";
import { GenreService } from "../genre/genre.service";

@Injectable()
export class MyMusicService {
  constructor(
    private myMusicRepository: MyMusicRepository,
    private myMusicGenreRepository: MyMusicGenreRepository,
    private myMusicFileRepository: MyMusicFileRepository,
    private userRepository: UserRepository,
    private genreService: GenreService,
  ) {}

  async createMusic(authToken: string, createMusicDto: CreateMusicDto): Promise<boolean> {
    try {
      const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

      if(userInfo.id == 0) {
        throw new ForbiddenException();
        return false;
      }

      await this.myMusicRepository.createMusic(userInfo.id, createMusicDto).then(async (myMusicId) => {
        await this.myMusicGenreRepository.createMusicGenre(myMusicId, createMusicDto);
        await this.myMusicFileRepository.createMusicFile(myMusicId, createMusicDto);
      });

      return true;
    } catch (e) {
      console.log(e);
      throw new RuntimeException();
    }
  }

  async updateMusic(myMusicId: number, updateMusicDto: UpdateMusicDto): Promise<boolean> {
    try {
      await this.myMusicRepository.updateMusic(myMusicId, updateMusicDto).then(async (result) => {
        if(typeof updateMusicDto.genreIds != 'undefined') {
          await this.myMusicGenreRepository.updateMusicGenre(myMusicId, updateMusicDto);
        }
        if(typeof updateMusicDto.musicFileId != 'undefined' && updateMusicDto.musicFileId != 0) {
          await this.myMusicFileRepository.updateMusicFile(myMusicId, updateMusicDto, 'MUSIC');
        }
        if(typeof updateMusicDto.imgFileId != 'undefined' && updateMusicDto.imgFileId != 0) {
          await this.myMusicFileRepository.updateMusicFile(myMusicId, updateMusicDto, 'IMAGE');
        }
      });

      return true;
    } catch (e) {
      console.log(e);
      throw new RuntimeException();
    }
  }

  async findMusicList(authToken: string, keyword: string): Promise<any> {

    let response: any = {};

    const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    if(userInfo.id == 0) {
      throw new ForbiddenException();
      return false;
    }

    response.connectorInfo = userInfo;
    response.musicList = await this.myMusicRepository.findMusicList(userInfo.id, keyword);

    return response;
  }

  async findMusicInfo(myMusicId: number): Promise<InfoMusicDto> {
    return await this.myMusicRepository.findMusicInfo(myMusicId);
  }

  async deleteMusic(myMusicId: number): Promise<boolean> {
    try {
      await this.myMusicGenreRepository.deleteMusicGenre(myMusicId).then(async () => {
        await this.myMusicFileRepository.deleteMusicFile(myMusicId).then(async () => {
          await this.myMusicRepository.deleteMusic(myMusicId);
        });
      });
      return true;
    } catch (e) {
      throw new RuntimeException();
    }
  }

  async updateMusicStatus(myMusicId: number, updateMusicStatusDto: UpdateMusicStatusDto): Promise<boolean> {
    try {
      await this.myMusicRepository.updateMusicStatus(myMusicId, updateMusicStatusDto);
      return true;
    } catch (e) {
      console.log(e);
      throw new RuntimeException();
    }
  }

  async uploadSongInitData(authToken: string) : Promise<any> {
    let response: any = {};

    const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

    if(userInfo.id == 0) {
      throw new ForbiddenException();
      return false;
    }

    response.connectorInfo = userInfo;
    response.genreList = await this.genreService.getGenreAll();

    return response;
  }
}
