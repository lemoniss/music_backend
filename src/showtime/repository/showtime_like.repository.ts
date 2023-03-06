import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { ShowtimeLikeEntity } from "../entity/showtime_like.entity";
import { CreateShowTimeLikeDto } from "../dto/create.showtimelike.dto";
import { UserGenreEntity } from "../../user/entity/user_genre.entity";

@EntityRepository(ShowtimeLikeEntity)
export class ShowtimeLikeRepository extends Repository<ShowtimeLikeEntity> {

  /**
   * 쇼타임 좋아요 정보 생성
   * @param createShowTimeDto
   */
  async patchLike(createShowTimeLikeDto: CreateShowTimeLikeDto) {
    try {

      const showtimeLikeInfo = await getRepository(ShowtimeLikeEntity)
        .createQueryBuilder('sl')
        .where('sl.showtimeEntity = :showtimeId', {showtimeId: createShowTimeLikeDto.showtimeId})
        .andWhere('sl.userEntity = :userId', {userId: createShowTimeLikeDto.userId})
        .getOne();

      if (!showtimeLikeInfo) {  // 데이터가 없으므로(좋아요 안했으므로) 좋아요 추가
        const showtimeEntity = new ShowtimeEntity();
        showtimeEntity.id = createShowTimeLikeDto.showtimeId;
        const userEntity = new UserEntity();
        userEntity.id = createShowTimeLikeDto.userId;
        // await this.save({
        //   showtimeEntity: showtimeEntity,
        //   userEntity: userEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeLikeEntity)
          .values({
            showtimeEntity: showtimeEntity,
            userEntity: userEntity,
          })
          .execute();
      } else {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(ShowtimeLikeEntity)
          .where('id = :showtimeLikeId', {showtimeLikeId: showtimeLikeInfo.id})
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async bulkLike(createShowTimeLikeDto: CreateShowTimeLikeDto) {
    try {

      const showtimeLikeInfo = await getRepository(ShowtimeLikeEntity)
        .createQueryBuilder('sl')
        .where('sl.showtimeEntity = :showtimeId', {showtimeId: createShowTimeLikeDto.showtimeId})
        .andWhere('sl.userEntity = :userId', {userId: createShowTimeLikeDto.userId})
        .getOne();

      if (!showtimeLikeInfo) {  // 데이터가 없으므로(좋아요 안했으므로) 좋아요 추가
        const showtimeEntity = new ShowtimeEntity();
        showtimeEntity.id = createShowTimeLikeDto.showtimeId;
        const userEntity = new UserEntity();
        userEntity.id = createShowTimeLikeDto.userId;

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeLikeEntity)
          .values({
            showtimeEntity: showtimeEntity,
            userEntity: userEntity,
          })
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
