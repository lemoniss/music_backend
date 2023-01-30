import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { GenreEntity } from "../entity/genre.entity";
import { NftMusicGenreEntity } from "../entity/nftmusic_genre.entity";
import { InfoMusicDto } from "../../mymusic/dto/info.music.dto";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { NftMusicFileEntity } from "../entity/nftmusic_file.entity";

@EntityRepository(NftMusicGenreEntity)
export class NftMusicGenreRepository extends Repository<NftMusicGenreEntity> {


  /**
   * 음악_장르 정보 생성
   * @param createUserDto
   */
  async createNftMusicGenre(nftMusicId: number, infoMusicDto: InfoMusicDto) {
    try {
      const nftMusicEntity = new NftMusicEntity();
      nftMusicEntity.id = nftMusicId;

      for(const genreId of infoMusicDto.genreIds) {
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
