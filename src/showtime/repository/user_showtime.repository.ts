import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { UserShowtimeEntity } from "../entity/user_showtime.entity";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { BaseUriEntity } from "../../upload/entity/base_uri.entity";

@EntityRepository(UserShowtimeEntity)
export class UserShowtimeRepository extends Repository<UserShowtimeEntity> {

  /**
   * Showtime_유저 정보 생성
   * @param createUserDto
   */
  async createUserShowtime(userId: number, showTimeId: number) {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = showTimeId;

      const userEntity = new UserEntity();
      userEntity.id = userId;

      // await this.save({
      //   userEntity: userEntity,
      //   showtimeEntity: showtimeEntity,
      // });
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserShowtimeEntity)
        .values({
          userEntity: userEntity,
          showtimeEntity: showtimeEntity,
        })
        .execute();
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * Showtime_유저 소유권 변경
   * @param userId
   * @param showTimeId
   */
  async updateUserShowtime(userId: number, showTimeId: number) {
    try {

      const userEntity = new UserEntity();
      userEntity.id = userId;

      await getConnection()
        .createQueryBuilder()
        .update(UserShowtimeEntity)
        .set({userEntity: userEntity})
        .where('showtimeEntity = :showTimeId', {showTimeId: showTimeId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
