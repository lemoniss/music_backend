import { EntityRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftHistoryEntity } from "../../nftmusic/entity/nfthistory.entity";
import { NftHistoryDto } from "../../nftmusic/dto/nfthistory.dto";

@EntityRepository(NftHistoryEntity)
export class NftHistoryRepository extends Repository<NftHistoryEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  // async nftHistory(nftHistoryDto: NftHistoryDto) {
  //   try {
  //     await this.save({
  //       userId: nftHistoryDto.userId,
  //       nftMusicId: nftHistoryDto.nftMusicId,
  //       price: nftHistoryDto.price,
  //       classification: nftHistoryDto.classification,
  //     });
  //
  //   } catch (e) {
  //     throw new RuntimeException('Server Error. Please try again later.');
  //   }
  // }

}
