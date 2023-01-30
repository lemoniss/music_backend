import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { ShowtimeLikeEntity } from "../entity/showtime_like.entity";
import { CreateShowTimeLikeDto } from "../dto/create.showtimelike.dto";
import { UserFollowerEntity } from "../entity/user_follower.entity";
import { CreateUserFollowerDto } from "../dto/create.userfollower.dto";
import { UserShowtimeEntity } from "../entity/user_showtime.entity";

@EntityRepository(UserFollowerEntity)
export class UserFollowerRepository extends Repository<UserFollowerEntity> {

  /**
   * 쇼타임 팔로우 정보 생성
   * @param createShowTimeDto
   */
  async patchFollower(createUserFollowerDto: CreateUserFollowerDto) {
    try {

      const userFollowerInfo = await getRepository(UserFollowerEntity)
        .createQueryBuilder('uf')
        .where('uf.userEntity = :userId', {userId: createUserFollowerDto.userId})
        .andWhere('uf.followerEntity = :followerId', {userId: createUserFollowerDto.followerId})
        .getOne();

      if (!userFollowerInfo) {  // 데이터가 없으므로(팔로우 안했으므로) 팔로우 추가

        const userEntity = new UserEntity();
        userEntity.id = createUserFollowerDto.userId;

        const followerEntity = new UserEntity();
        followerEntity.id = createUserFollowerDto.followerId;

        // await this.save({
        //   userEntity: userEntity,
        //   followerEntity: followerEntity,
        // });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserFollowerEntity)
          .values({
            userEntity: userEntity,
            followerEntity: followerEntity,
          })
          .execute();
      } else {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(ShowtimeLikeEntity)
          .where('id = :userFollowId', {userFollowId: userFollowerInfo.id})
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
