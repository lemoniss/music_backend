import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { FileEntity } from "../entity/file.entity";
import { NftMusicFileEntity } from "../entity/nftmusic_file.entity";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { CreateNftDto } from "../dto/create.nft.dto";
import { BannerLikeEntity } from "../entity/banner_like.entity";

@EntityRepository(NftMusicFileEntity)
export class UpcomingToRecentFileRepository extends Repository<NftMusicFileEntity> {

  /**
   * 음악_파일 정보 생성
   * @param createUserDto
   */
  async createNftMusicFile(nftMusicId: number, createNftDto: CreateNftDto) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      let fileEntity = new FileEntity();
      fileEntity.id = createNftDto.musicFileId;
      // await this.save({
      //   nftMusicEntity: nftMusicEntity,
      //   fileEntity: fileEntity,
      //   fileType: 'MUSIC',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftMusicFileEntity)
        .values({
          nftMusicEntity: nftMusicEntity,
          fileEntity: fileEntity,
          fileType: 'MUSIC',
        })
        .execute();

      fileEntity = new FileEntity();
      fileEntity.id = createNftDto.imgFileId;
      // await this.save({
      //   nftMusicEntity: nftMusicEntity,
      //   fileEntity: fileEntity,
      //   fileType: 'IMAGE',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftMusicFileEntity)
        .values({
          nftMusicEntity: nftMusicEntity,
          fileEntity: fileEntity,
          fileType: 'IMAGE',
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
