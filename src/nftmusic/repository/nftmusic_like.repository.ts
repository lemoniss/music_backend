import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicLikeEntity } from "../entity/nftmusic_like.entity";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { UserEntity } from "../entity/user.entity";
import { NftLikeDto } from "../dto/like.nft.dto";
import { ShowtimeDistributorEntity } from "../../showtime/entity/showtime_distributor.entity";

@EntityRepository(NftMusicLikeEntity)
export class NftMusicLikeRepository extends Repository<NftMusicLikeEntity> {

  /**
   * NFT좋아요 정보 생성
   * @param createUserDto
   */
  async createNftLike(nftLikeDto: NftLikeDto) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftLikeDto.nftMusicId;

      const userEntity = new UserEntity();
      userEntity.id = nftLikeDto.userId;

      // await this.save({
      //   userEntity: userEntity,
      //   nftMusicEntity: nftMusicEntity,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftMusicLikeEntity)
        .values({
          userEntity: userEntity,
          nftMusicEntity: nftMusicEntity,
        })
        .execute();

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * NFT좋아요 삭제
   * @param myMusicId
   */
  async deleteNftLike(nftLikeDto: NftLikeDto) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(NftMusicLikeEntity)
        .where('nftMusicEntity = :nftMusicId', {nftMusicId: nftLikeDto.nftMusicId})
        .andWhere('userEntity = :userId', {userId: nftLikeDto.userId})
        .execute();
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
