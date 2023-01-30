import { EntityRepository, getConnection, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { UpdateUserDto } from "../dto/update.user.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserGenreEntity } from "../entity/user_genre.entity";
import { GenreEntity } from "../../nftmusic/entity/genre.entity";
import { NftMusicFileEntity } from "../../showtime/entity/nftmusic_file.entity";

@EntityRepository(UserGenreEntity)
export class UserGenreRepository extends Repository<UserGenreEntity> {

  /**
   * 사용자 파일 관계데이터 생성
   * @param updateUserDto
   */
  async createUserGenre(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserGenreEntity)
        .where('userEntity = :userId', {userId: id})
        .execute();

      const userEntity = new UserEntity();
      userEntity.id = id;

      for(const genreId of updateUserDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   userEntity: userEntity,
        //   genreEntity: genreEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserGenreEntity)
          .values({
            userEntity: userEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }

      return true;
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
