import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { BannerLikeEntity } from "../entity/banner_like.entity";
import { CreateBannerLikeDto } from "../dto/create.bannerlike.dto";
import { BannerEntity } from "../entity/banner.entity";
import { ShowtimeHolderEntity } from "../entity/showtime_holder.entity";

@EntityRepository(BannerLikeEntity)
export class BannerLikeRepository extends Repository<BannerLikeEntity> {

  /**
   * 배너 좋아요 정보 생성
   * @param createBannerLikeDto
   */
  async patchLike(createBannerLikeDto: CreateBannerLikeDto) {
    try {

      const bannerLikeInfo = await getRepository(BannerLikeEntity)
        .createQueryBuilder('bl')
        .where('bl.bannerEntity = :bannerId', {bannerId: createBannerLikeDto.bannerId})
        .andWhere('bl.userEntity = :userId', {userId: createBannerLikeDto.userId})
        .getOne();

      if (!bannerLikeInfo) {  // 데이터가 없으므로(좋아요 안했으므로) 좋아요 추가
        const bannerEntity = new BannerEntity();
        bannerEntity.id = createBannerLikeDto.bannerId;
        const userEntity = new UserEntity();
        userEntity.id = createBannerLikeDto.userId;
        // await this.save({
        //   bannerEntity: bannerEntity,
        //   userEntity: userEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BannerLikeEntity)
          .values({
            bannerEntity: bannerEntity,
            userEntity: userEntity,
          })
          .execute();
      } else {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(BannerLikeEntity)
          .where('id = :bannerLikeId', {bannerLikeId: bannerLikeInfo.id})
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
