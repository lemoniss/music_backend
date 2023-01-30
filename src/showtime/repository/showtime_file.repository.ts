import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { FileEntity } from "../entity/file.entity";
import { ShowtimeFileEntity } from "../entity/showtime_file.entity";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { ShowtimeGenreEntity } from "../entity/showtime_genre.entity";

@EntityRepository(ShowtimeFileEntity)
export class ShowtimeFileRepository extends Repository<ShowtimeFileEntity> {

  /**
   * 음악_파일 정보 생성
   * @param createUserDto
   */
  async createShowtimeFile(showtimeTierId: number, fileId: number, fileType: String) {
    try {
      const showtimeTierEntity = new ShowtimeTierEntity();
      showtimeTierEntity.id = showtimeTierId;

      const fileEntity = new FileEntity();
      fileEntity.id = fileId;

      if(fileType == 'MUSIC') {
        // await this.save({
        //   showtimeTierEntity: showtimeTierEntity,
        //   fileEntity: fileEntity,
        //   fileType: 'MUSIC',
        // });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeFileEntity)
          .values({
            showtimeTierEntity: showtimeTierEntity,
            fileEntity: fileEntity,
            fileType: 'MUSIC',
          })
          .execute();
      } else if(fileType == 'IMAGE') {
        // await this.save({
        //   showtimeTierEntity: showtimeTierEntity,
        //   fileEntity: fileEntity,
        //   fileType: 'IMAGE',
        // });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeFileEntity)
          .values({
            showtimeTierEntity: showtimeTierEntity,
            fileEntity: fileEntity,
            fileType: 'IMAGE',
          })
          .execute();
      } else {
        // await this.save({
        //   showtimeTierEntity: showtimeTierEntity,
        //   fileEntity: fileEntity,
        //   fileType: 'RARE',
        // });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeFileEntity)
          .values({
            showtimeTierEntity: showtimeTierEntity,
            fileEntity: fileEntity,
            fileType: 'RARE',
          })
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('createShowtimeFile Server Error. Please try again later.');
    }
  }

}
