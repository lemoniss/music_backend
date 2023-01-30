import { EntityRepository, getConnection, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { CreateNftDto } from "../dto/create.nft.dto";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { FileEntity } from "../../upload/entity/file.entity";

@EntityRepository(NftMusicEntity)
export class UpcomingToRecentRepository extends Repository<NftMusicEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  async createNft(createNftDto: CreateNftDto): Promise<number> {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = createNftDto.showtimeId;

      // const nftMusic = await this.save({
      //   ipfsHash: createNftDto.ipfsHash,
      //   tokenId: createNftDto.tokenId,
      //   minter: 'showtime',
      //   title: createNftDto.title,
      //   name: createNftDto.name,
      //   artist: createNftDto.artist,
      //   description: createNftDto.description,
      //   playTime: createNftDto.playTime,
      //   playCount: 0,
      //   isOnSale: 'N',
      //   source: 'showtime',
      //   handle: createNftDto.handle,
      //   showtimeEntity: showtimeEntity,
      // });
      //
      // return nftMusic.id;

      const nftMusic = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftMusicEntity)
        .values({
          ipfsHash: createNftDto.ipfsHash,
          tokenId: createNftDto.tokenId,
          minter: 'showtime',
          title: createNftDto.title,
          name: createNftDto.name,
          artist: createNftDto.artist,
          description: createNftDto.description,
          playTime: createNftDto.playTime,
          playCount: 0,
          isOnSale: 'N',
          source: 'showtime',
          handle: createNftDto.handle,
          showtimeEntity: showtimeEntity,
        })
        .execute();

      return nftMusic.raw.insertId;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
