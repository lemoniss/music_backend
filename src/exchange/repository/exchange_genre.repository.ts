import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { GenreEntity } from "../entity/genre.entity";
import { ExchangeGenreEntity } from "../entity/exchange_genre.entity";
import { ExchangeEntity } from "../entity/exchange.entity";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { ExchangeFileEntity } from "../entity/exchange_file.entity";

@EntityRepository(ExchangeGenreEntity)
export class ExchangeGenreRepository extends Repository<ExchangeGenreEntity> {


  /**
   * 거래소_장르 정보 생성
   * @param createUserDto
   */
  async registerExchangeGenre(exchangeId: number, infoNftDto: InfoNftDto) {
    try {
      const exchangeEntity = new ExchangeEntity();
      exchangeEntity.id = exchangeId;

      for(const genreId of infoNftDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   exchangeEntity: exchangeEntity,
        //   genreEntity: genreEntity,
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ExchangeGenreEntity)
          .values({
            exchangeEntity: exchangeEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 거래소_장르 정보 삭제
   * @param exchangeId
   */
  async deleteExchangeGenre(exchangeId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ExchangeGenreEntity)
        .where('exchangeEntity = :exchangeId', {exchangeId: exchangeId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
