import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserExchangeEntity } from "../entity/user_exchange.entity";
import { ExchangeEntity } from "../entity/exchange.entity";
import { UserEntity } from "../entity/user.entity";
import { ExchangeGenreEntity } from "../entity/exchange_genre.entity";
import { MyMusicGenreEntity } from "../../mymusic/entity/mymusic_genre.entity";

@EntityRepository(UserExchangeEntity)
export class UserExchangeRepository extends Repository<UserExchangeEntity> {

  /**
   * 거래소_유저 정보 생성
   * @param createUserDto
   */
  async registerUserExchange(userId: number, exchangeId: number) {
    try {
      const exchangeEntity = new ExchangeEntity();
      exchangeEntity.id = exchangeId;

      const userEntity = new UserEntity();
      userEntity.id = userId;

      // await this.save({
      //   userEntity: userEntity,
      //   exchangeEntity: exchangeEntity,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserExchangeEntity)
        .values({
          userEntity: userEntity,
          exchangeEntity: exchangeEntity,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 거래소_유저 정보 삭제
   * @param exchangeId
   */
  async deleteUserExchange(exchangeId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserExchangeEntity)
        .where('exchangeEntity = :exchangeId', {exchangeId: exchangeId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
