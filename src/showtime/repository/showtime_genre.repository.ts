import { EntityRepository, getConnection, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { ShowtimeGenreEntity } from "../entity/showtime_genre.entity";
import { GenreEntity } from "../entity/genre.entity";
import { CreateShowTimeDataDto } from "../dto/create.showtimedata.dto";
import { ShowtimeLikeEntity } from "../entity/showtime_like.entity";

@EntityRepository(ShowtimeGenreEntity)
export class ShowtimeGenreRepository extends Repository<ShowtimeGenreEntity> {

  /**
   * 음악_장르 정보 생성
   * @param createShowTimeDto
   */
  async createShowtimeGenre(showtimeId: number, createShowTimeDataDto: CreateShowTimeDataDto) {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = showtimeId;

      for(const genreId of createShowTimeDataDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   showtimeEntity: showtimeEntity,
        //   genreEntity: genreEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeGenreEntity)
          .values({
            showtimeEntity: showtimeEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
