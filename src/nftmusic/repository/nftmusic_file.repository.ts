import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { FileEntity } from "../entity/file.entity";
import { NftMusicFileEntity } from "../entity/nftmusic_file.entity";
import { InfoMusicDto } from "../../mymusic/dto/info.music.dto";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { NftHistoryEntity } from "../entity/nfthistory.entity";

@EntityRepository(NftMusicFileEntity)
export class NftMusicFileRepository extends Repository<NftMusicFileEntity> {

  /**
   * 음악_파일 정보 생성
   * @param createUserDto
   */
  async createNftMusicFile(nftMusicId: number, infoMusicDto: InfoMusicDto) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      for(const fileObj of infoMusicDto.files) {
        const fileEntity = new FileEntity();
        fileEntity.id = fileObj.fileId;
        // await this.save({
        //   nftMusicEntity: nftMusicEntity,
        //   fileEntity: fileEntity,
        //   fileType: fileObj.filetype,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(NftMusicFileEntity)
          .values({
            nftMusicEntity: nftMusicEntity,
            fileEntity: fileEntity,
            fileType: fileObj.filetype,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
