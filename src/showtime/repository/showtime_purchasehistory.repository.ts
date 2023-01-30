import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserEntity } from "../entity/user.entity";
import { ShowtimePurchaseHistoryEntity } from "../entity/showtime_purchasehistory.entity";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { PurchaseShowtimeDto } from "../dto/purchase.showtime.dto";
import { ShowtimeFileEntity } from "../entity/showtime_file.entity";

@EntityRepository(ShowtimePurchaseHistoryEntity)
export class ShowtimePurchasehistoryRepository extends Repository<ShowtimePurchaseHistoryEntity> {

  /**
   * Showtime_구매내역
   * @param createUserDto
   */
  async createShowtimePurchasehistory(purchaseHistoryShowtimeDto: PurchaseShowtimeDto) {
    try {
      const showtimeTierEntity = new ShowtimeTierEntity();
      showtimeTierEntity.id = purchaseHistoryShowtimeDto.showTimeTierId;

      const userEntity = new UserEntity();
      userEntity.id = purchaseHistoryShowtimeDto.userId;

      // await this.save({
      //   userEntity: userEntity,
      //   showtimeTierEntity: showtimeTierEntity,
      //   symbol: purchaseHistoryShowtimeDto.symbol,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimePurchaseHistoryEntity)
        .values({
          userEntity: userEntity,
          showtimeTierEntity: showtimeTierEntity,
          symbol: purchaseHistoryShowtimeDto.symbol,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
