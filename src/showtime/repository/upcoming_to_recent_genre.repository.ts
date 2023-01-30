import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { GenreEntity } from "../entity/genre.entity";
import { NftMusicGenreEntity } from "../entity/nftmusic_genre.entity";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { CreateNftDto } from "../dto/create.nft.dto";
import { ShowtimePurchaseHistoryEntity } from "../entity/showtime_purchasehistory.entity";

@EntityRepository(NftMusicGenreEntity)
export class UpcomingToRecentGenreRepository extends Repository<NftMusicGenreEntity> {


  /**
   * 음악_장르 정보 생성
   * @param createUserDto
   */
  async createNftMusicGenre(nftMusicId: number, createNftDto: CreateNftDto) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      for(const genreId of createNftDto.genreIds) {
        const genreEntity = new GenreEntity();
        genreEntity.id = genreId;
        // await this.save({
        //   nftMusicEntity: nftMusicEntity,
        //   genreEntity: genreEntity,
        // });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(NftMusicGenreEntity)
          .values({
            nftMusicEntity: nftMusicEntity,
            genreEntity: genreEntity,
          })
          .execute();
      }
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
