import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { NftMusicDistributorEntity } from "../entity/nftmusic_distributor.entity";
import { InfoDistributorDto } from "../dto/info.distributor.dto";

@EntityRepository(NftMusicDistributorEntity)
export class NftMusicDistributorRepository extends Repository<NftMusicDistributorEntity> {

  /**
   * 음악 수익 분배자 저장
   * @param createUserDto
   */
  async createNftMusicDistributor(nftMusicId: number, distributors: InfoDistributorDto[]) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      for(const distributor of distributors) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(NftMusicDistributorEntity)
          .values({
            nftMusicEntity: nftMusicEntity,
            address: distributor.address,
            percent: distributor.percent,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
