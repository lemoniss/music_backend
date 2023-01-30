import { EntityRepository, getConnection, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { ShowtimeDistributorEntity } from "../entity/showtime_distributor.entity";
import { CreateShowTimeDataDto } from "../dto/create.showtimedata.dto";
import { UserNftMusicEntity } from "../../nftmusic/entity/user_nftmusic.entity";

@EntityRepository(ShowtimeDistributorEntity)
export class ShowtimeDistributorRepository extends Repository<ShowtimeDistributorEntity> {

  /**
   * 쇼타임_분배자 정보 생성
   * @param createShowTimeDto
   */
  async createShowtimeDistributor(showtimeId: number, createShowTimeDataDto: CreateShowTimeDataDto) {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = showtimeId;

      for(const infoDistributorDto of createShowTimeDataDto.distributors) {
        // await this.save({
        //   showtimeEntity: showtimeEntity,
        //   address: infoDistributorDto.distributorAddress,
        //   name: infoDistributorDto.distributorName,
        //   percent: infoDistributorDto.distributorPer,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ShowtimeDistributorEntity)
          .values({
            showtimeEntity: showtimeEntity,
            address: infoDistributorDto.distributorAddress,
            name: infoDistributorDto.distributorName,
            percent: infoDistributorDto.distributorPer,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
