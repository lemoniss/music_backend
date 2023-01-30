import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserNftMusicEntity } from "../entity/user_nftmusic.entity";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { UserEntity } from "../entity/user.entity";
import { NftLikeDto } from "../dto/like.nft.dto";
import { NftMusicLikeEntity } from "../entity/nftmusic_like.entity";
import { BannerFileEntity } from "../../showtime/entity/banner_file.entity";

@EntityRepository(UserNftMusicEntity)
export class UserNftMusicRepository extends Repository<UserNftMusicEntity> {

  /**
   * User NFT 정보 생성
   * @param createUserDto
   */
  async createUserNftMusic(userId: number, nftMusicId: number) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      const userEntity = new UserEntity();
      userEntity.id = userId;

      // await this.save({
      //   userEntity: userEntity,
      //   nftMusicEntity: nftMusicEntity,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserNftMusicEntity)
        .values({
          userEntity: userEntity,
          nftMusicEntity: nftMusicEntity,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * User NFT 정보 삭제
   * @param myMusicId
   */
  async deleteUserNftMusic(nftMusicId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserNftMusicEntity)
        .where('nftMusicEntity = :nftMusicId', {nftMusicId: nftMusicId})
        .execute();
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
