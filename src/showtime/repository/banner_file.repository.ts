import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { BannerFileEntity } from "../entity/banner_file.entity";
import { BannerEntity } from "../entity/banner.entity";
import { CreateBannerDataDto } from "../dto/create.bannerdata.dto";
import { FileEntity } from "../entity/file.entity";
import { ShowtimeCrewEntity } from "../entity/showtime_crew.entity";

@EntityRepository(BannerFileEntity)
export class BannerFileRepository extends Repository<BannerFileEntity> {

  /**
   * 배너파일 생성
   * @param createShowTimeDto
   */
  async createBannerFile(bannerId: number, createBannerFileDto: CreateBannerDataDto) {
    try {
      const bannerFileInfo = await getRepository(BannerFileEntity)
        .createQueryBuilder('bf')
        .where('bf.bannerEntity = :bannerId', {bannerId: bannerId})
        .andWhere('bf.fileEntity = :fileId', {fileId: createBannerFileDto.fileId})
        .getOne();

      if(bannerFileInfo) {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(BannerFileEntity)
          .where('id = :bannerFileId', {bannerFileId: bannerFileInfo.id})
          .execute();
      }

      const bannerEntity = new BannerEntity();
      bannerEntity.id = bannerId;

      const fileEntity = new FileEntity();
      fileEntity.id = createBannerFileDto.fileId;

      // await this.save({
      //   bannerEntity: bannerEntity,
      //   fileEntity: fileEntity,
      // })

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(BannerFileEntity)
        .values({
          bannerEntity: bannerEntity,
          fileEntity: fileEntity,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('BannerFile Server Error. Please try again later.');
    }
  }
}
