import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { FileEntity } from "../entity/file.entity";
import { ExchangeFileEntity } from "../entity/exchange_file.entity";
import { ExchangeEntity } from "../entity/exchange.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { MyMusicFileEntity } from "../../mymusic/entity/mymusic_file.entity";
import { UserSnsEntity } from "../../user/entity/user_sns.entity";

@EntityRepository(ExchangeFileEntity)
export class ExchangeFileRepository extends Repository<ExchangeFileEntity> {

  /**
   * 거래소_파일 정보 생성
   * @param createUserDto
   */
  async registerExchangeFile(exchangeId: number, infoNftDto: InfoNftDto) {
    try {
      const exchangeEntity = new ExchangeEntity();
      exchangeEntity.id = exchangeId;

      for(const fileObj of infoNftDto.files) {
        const fileEntity = new FileEntity();
        fileEntity.id = fileObj.fileId;
        // await this.save({
        //   exchangeEntity: exchangeEntity,
        //   fileEntity: fileEntity,
        //   fileType: fileObj.filetype,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ExchangeFileEntity)
          .values({
            exchangeEntity: exchangeEntity,
            fileEntity: fileEntity,
            fileType: fileObj.filetype,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 거래소_파일 정보 삭제
   * @param exchangeId
   */
  async deleteExchangeFile(exchangeId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ExchangeFileEntity)
        .where('exchangeEntity = :exchangeId', {exchangeId: exchangeId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
