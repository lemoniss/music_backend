import { EntityRepository, getConnection, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { UpdateUserDto } from "../dto/update.user.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserGenreEntity } from "../entity/user_genre.entity";
import { GenreEntity } from "../../nftmusic/entity/genre.entity";
import { UserSnsEntity } from "../entity/user_sns.entity";
import { ShowtimeTierEntity } from "../../showtime/entity/showtime_tier.entity";

@EntityRepository(UserSnsEntity)
export class UserSnsRepository extends Repository<UserSnsEntity> {

  /**
   * 사용자 파일 관계데이터 생성
   * @param updateUserDto
   */
  async createUserSns(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserSnsEntity)
        .where('userEntity = :userId', {userId: id})
        .execute();

      const userEntity = new UserEntity();
      userEntity.id = id;

      for(const userSnsDto of updateUserDto.userSnsModels) {
        // await this.save({
        //   userEntity: userEntity,
        //   name: userSnsDto.name,
        //   snsHandle: userSnsDto.snsHandle.replace('@', ''),
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserSnsEntity)
          .values({
            userEntity: userEntity,
            name: userSnsDto.name,
            snsHandle: userSnsDto.snsHandle.replace('@', ''),
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
