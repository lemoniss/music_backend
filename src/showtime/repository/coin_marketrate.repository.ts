import { EntityRepository, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CoinMarketRateEntity } from "../entity/coin_marketrate.entity";
import { CoinMarketRateDto } from "../dto/create.coinmarketrate.dto";

@EntityRepository(CoinMarketRateEntity)
export class CoinMarketRateRepository extends Repository<CoinMarketRateEntity> {

  async getCoinCurrency(): Promise<CoinMarketRateDto[]> {
    try {

      const results = await getRepository(CoinMarketRateEntity)
        .createQueryBuilder('c')
        .getMany();

      const coinMarketRates = [];

      for(const info of results) {
        const rateDto = new CoinMarketRateDto();
        rateDto.name = info.name;
        rateDto.rate = info.rate;
        rateDto.currency = info.currency;

        coinMarketRates.push(rateDto);
      }

      return coinMarketRates;

    } catch (e) {
      throw new RuntimeException('saveCoinMarketRate Server Error. Please try again later.');
    }
  }

  async getTargetCoinCurrency(target: string): Promise<string> {
    try {

      const result = await getRepository(CoinMarketRateEntity)
        .createQueryBuilder('c')
        .where('c.name = :target', {target: target})
        .getOne();

      return result.rate;

    } catch (e) {
      throw new RuntimeException('saveCoinMarketRate Server Error. Please try again later.');
    }
  }

}
