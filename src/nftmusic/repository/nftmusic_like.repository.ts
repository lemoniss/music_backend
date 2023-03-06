import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicLikeEntity } from "../entity/nftmusic_like.entity";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { UserEntity } from "../entity/user.entity";
import { NftLikeDto } from "../dto/like.nft.dto";
import { ShowtimeDistributorEntity } from "../../showtime/entity/showtime_distributor.entity";
import { CreateShowTimeLikeDto } from "../../showtime/dto/create.showtimelike.dto";
import { ShowtimeLikeEntity } from "../../showtime/entity/showtime_like.entity";
import { ShowtimeEntity } from "../../showtime/entity/showtime.entity";
import { PatchLikeNftDto } from "../dto/patchlike.nft.dto";

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

  async patchLike(userId: number, patchLikeNftDto: PatchLikeNftDto): Promise<boolean> {
    try {

      const nftLikeInfo = await getRepository(NftMusicLikeEntity)
        .createQueryBuilder('nl')
        .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: patchLikeNftDto.nftMusicId})
        .andWhere('nl.userEntity = :userId', {userId: userId})
        .getOne();

      if (!nftLikeInfo) {  // 데이터가 없으므로(좋아요 안했으므로) 좋아요 추가
        const nftMusicEntity = new NftMusicEntity();
        nftMusicEntity.id = patchLikeNftDto.nftMusicId;

        const userEntity = new UserEntity();
        userEntity.id = userId;

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(NftMusicLikeEntity)
          .values({
            userEntity: userEntity,
            nftMusicEntity: nftMusicEntity,
          })
          .execute();
      } else {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(NftMusicLikeEntity)
          .where('nftMusicEntity = :nftMusicId', {nftMusicId: patchLikeNftDto.nftMusicId})
          .andWhere('userEntity = :userId', {userId: userId})
          .execute();
      }
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async bulkLike(userId: number, patchLikeNftDto: PatchLikeNftDto): Promise<boolean> {
    try {

      const nftLikeInfo = await getRepository(NftMusicLikeEntity)
        .createQueryBuilder('nl')
        .where('nl.nftMusicEntity = :nftMusicId', {nftMusicId: patchLikeNftDto.nftMusicId})
        .andWhere('nl.userEntity = :userId', {userId: userId})
        .getOne();

      if (!nftLikeInfo) {  // 데이터가 없으므로(좋아요 안했으므로) 좋아요 추가
        const nftMusicEntity = new NftMusicEntity();
        nftMusicEntity.id = patchLikeNftDto.nftMusicId;

        const userEntity = new UserEntity();
        userEntity.id = userId;

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(NftMusicLikeEntity)
          .values({
            userEntity: userEntity,
            nftMusicEntity: nftMusicEntity,
          })
          .execute();
      }
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }
}
