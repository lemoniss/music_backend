import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserFollowerEntity } from "../entity/user_follower.entity";
import { CreateUserFollowerDto } from "../dto/create.userfollower.dto";
import { UserEntity } from "../entity/user.entity";

@EntityRepository(UserFollowerEntity)
export class UserFollowerRepository extends Repository<UserFollowerEntity> {

  /**
   * 쇼타임 팔로우 정보 생성
   * @param createShowTimeDto
   */
  async patchFollower(userId: number, createUserFollowerDto: CreateUserFollowerDto): Promise<boolean> {
    try {

      const userFollowerInfo = await getRepository(UserFollowerEntity)
        .createQueryBuilder('uf')
        .where('uf.userEntity = :userId', {userId: userId})
        .andWhere('uf.followerEntity = :followerId', {followerId: createUserFollowerDto.followerId})
        .getOne();

      if (!userFollowerInfo) {  // 데이터가 없으므로(팔로우 안했으므로) 팔로우 추가

        const userEntity = new UserEntity();
        userEntity.id = userId;

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
          .from(UserFollowerEntity)
          .where('userEntity = :userId', {userId: userId})
          .andWhere('followerEntity = :followId', {followId: createUserFollowerDto.followerId})
          .execute();
      }
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

}
