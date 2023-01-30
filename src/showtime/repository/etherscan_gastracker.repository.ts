import { EntityRepository, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { EtherscanGastrackerEntity } from "../entity/etherscan_gastracker.entity";
import { EtherscanGastrackerDto } from "../dto/create.etherscangastracker.dto";

@EntityRepository(EtherscanGastrackerEntity)
export class EtherscanGastrackerRepository extends Repository<EtherscanGastrackerEntity> {

  async getGasTracker(): Promise<EtherscanGastrackerDto> {
    try {

      const results = await getRepository(EtherscanGastrackerEntity)
        .createQueryBuilder('e')
        .getOne();

      const etherscanGastrackerDto = new EtherscanGastrackerDto();
      etherscanGastrackerDto.safeGasPrice = results.safeGasPrice;
      etherscanGastrackerDto.proposeGasPrice = results.proposeGasPrice;
      etherscanGastrackerDto.fastGasPrice = results.fastGasPrice;
      return etherscanGastrackerDto;

    } catch (e) {
      throw new RuntimeException('getGasTracker Server Error. Please try again later.');
    }
  }

}
