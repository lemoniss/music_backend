import { EntityRepository, getConnection, Repository } from "typeorm";
import { MyMusicEntity } from "../entity/mymusic.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateMusicDto } from "../dto/create.music.dto";
import { MyMusicGenreEntity } from "../entity/mymusic_genre.entity";
import { GenreEntity } from "../entity/genre.entity";
import { UpdateMusicDto } from "../dto/update.music.dto";

@EntityRepository(MyMusicGenreEntity)
export class MyMusicGenreRepository extends Repository<MyMusicGenreEntity> {


  /**
   * 음악_장르 정보 생성
   * @param createUserDto
   */
  async createMusicGenre(myMusicId: number, createMusicDto: CreateMusicDto) {
    try {
      const myMusicEntity = new MyMusicEntity();
      myMusicEntity.id = myMusicId;

      for(const genreId of createMusicDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   myMusicEntity: myMusicEntity,
        //   genreEntity: genreEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(MyMusicGenreEntity)
          .values({
            myMusicEntity: myMusicEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악_장르 정보 갱신
   * @param createUserDto
   */
  async updateMusicGenre(myMusicId: number, updateMusicDto: UpdateMusicDto) {
    try {
      const myMusicEntity = new MyMusicEntity();
      myMusicEntity.id = myMusicId;

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MyMusicGenreEntity)
        .where('myMusicEntity = :myMusicId', {myMusicId: myMusicId})
        .execute();

      for(const genreId of updateMusicDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   myMusicEntity: myMusicEntity,
        //   genreEntity: genreEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(MyMusicGenreEntity)
          .values({
            myMusicEntity: myMusicEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악_장르 삭제
   * @param myMusicId
   */
  async deleteMusicGenre(myMusicId: number) {
    try {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MyMusicGenreEntity)
        .where('myMusicEntity = :myMusicId', {myMusicId: myMusicId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
