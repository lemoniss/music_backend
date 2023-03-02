import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { ShowtimeTierEntity } from "../entity/showtime_tier.entity";
import { CreateShowTimeDataDto } from "../dto/create.showtimedata.dto";
import { ResponseTierListDto } from "../dto/response.tierlist.dto";
import { ResponseTierInfoDto } from "../dto/response.tierinfo.dto";
import { InfoNftDto } from "../../nftmusic/dto/info.nft.dto";
import { Formatter } from "../../util/formatter";

@EntityRepository(ShowtimeTierEntity)
export class ShowtimeTierRepository extends Repository<ShowtimeTierEntity> {

  /**
   * showtime_tier 정보 생성
   * @param createShowTimeDto
   */
  async createShowtimeTier(showtimeId: number, createShowTimeDataDto: CreateShowTimeDataDto): Promise<number> {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = showtimeId;

      let rareYn = 'N';

      if(typeof createShowTimeDataDto.rares != 'undefined') {
        for(const infoRareDto of createShowTimeDataDto.rares) {
          if(infoRareDto.no == createShowTimeDataDto.no) {
            rareYn = 'Y';
          }
        }
      }

      // const showTimeTierEntity = await this.save({
      //   showtimeEntity: showtimeEntity,
      //   tier: createShowTimeDataDto.tier,
      //   description: createShowTimeDataDto.description,
      //   name: createShowTimeDataDto.name,
      //   songNo: createShowTimeDataDto.no,
      //   purchaseYn: 'N',
      //   ipfsHash: createShowTimeDataDto.ipfsHash,
      //   price: createShowTimeDataDto.price.toString(),
      //   tokenId: createShowTimeDataDto.tokenId,
      //   rareYn: rareYn,
      // });
      // return showTimeTierEntity.id;

      const showtimeTier = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimeTierEntity)
        .values({
          showtimeEntity: showtimeEntity,
          tier: createShowTimeDataDto.tier,
          description: createShowTimeDataDto.description,
          name: createShowTimeDataDto.name,
          songNo: createShowTimeDataDto.no,
          purchaseYn: 'N',
          ipfsHash: createShowTimeDataDto.ipfsHash,
          price: createShowTimeDataDto.price.toString(),
          tokenId: createShowTimeDataDto.tokenId,
          rareYn: rareYn,
        })
        .execute();

      return showtimeTier.raw.insertId;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async showtimeTierPurchaseStatusUpdate(showTimeTierId: number) : Promise<boolean> {
    try {

      await getConnection()
        .createQueryBuilder()
        .update(ShowtimeTierEntity)
        .set({purchaseYn: 'Y'})
        .where('id = :showTimeTierId', {showTimeTierId: showTimeTierId})
        .execute();

      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
      return false;
    }
  }

  async getTiers(tier:string, showtimeId: number): Promise<ResponseTierListDto[]> {
    const tierList = await getRepository(ShowtimeTierEntity)
      .createQueryBuilder('st')
      .where('st.showtimeEntity = :showtimeId', {showtimeId: showtimeId})
      .andWhere('st.tier = :tier', {tier: tier})
      .orderBy('st.songNo', 'ASC')
      .getMany();
    if (!tierList) {
      let responseList = [];
      const responseObj = new ResponseTierListDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const tier of tierList) {
      const responseTierDto = new ResponseTierListDto();
      responseTierDto.tierId = Number(tier.id);
      responseTierDto.purchaseYn = tier.purchaseYn;
      responseTierDto.songNo = Number(tier.songNo);
      responseTierDto.tokenId = tier.tokenId;
      responseTierDto.price = tier.price;
      responseTierDto.name = tier.name;
      responseTierDto.tier = tier.tier;
      responseList.push(responseTierDto);
    }

    return responseList;
  }

  async getTiersTokenId(showtimeId: number): Promise<ResponseTierListDto[]> {
    const tierList = await getRepository(ShowtimeTierEntity)
      .createQueryBuilder('st')
      .where('st.showtimeEntity = :showtimeId', {showtimeId: showtimeId})
      .orderBy('st.id', 'ASC')
      .getMany();
    if (!tierList) {
      let responseList = [];
      const responseObj = new ResponseTierListDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const tier of tierList) {
      const responseTierDto = new ResponseTierListDto();
      responseTierDto.tierId = Number(tier.id);
      responseTierDto.purchaseYn = tier.purchaseYn;
      responseTierDto.songNo = Number(tier.songNo);
      responseTierDto.tokenId = tier.tokenId;
      responseTierDto.price = tier.price;
      responseTierDto.name = tier.name;
      responseTierDto.tier = tier.tier;
      responseList.push(responseTierDto);
    }

    return responseList;
  }

  async getTierInfo(showTimeTierId: number): Promise<ResponseTierInfoDto> {
    const tierInfo = await getRepository(ShowtimeTierEntity)
      .createQueryBuilder('st')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('s.nftMusicEntity', 'n')
      .where('st.id = :showTimeTierId', {showTimeTierId: showTimeTierId})
      .getOne();
    if (!tierInfo) {
      const responseObj = new ResponseTierInfoDto();
      return responseObj;
    }

    const responseTierDto = new ResponseTierInfoDto();
    responseTierDto.tierId = Number(tierInfo.id);
    responseTierDto.showtimeId = Number(tierInfo.showtimeEntity.id);
    responseTierDto.nftMusicId = Number(tierInfo.showtimeEntity.nftMusicEntity.id);
    responseTierDto.price = tierInfo.price;

    return responseTierDto;
  }

  static async getL2eToShowtimeId(showtimeId: string): Promise<InfoNftDto> {
    const tierInfo = await getRepository(ShowtimeTierEntity)
      .createQueryBuilder('st')
      .leftJoinAndSelect('st.showtimeEntity', 's')
      .leftJoinAndSelect('st.showtimeFileEntity', 'sf')
      .leftJoinAndSelect('sf.fileEntity', 'f')
      .leftJoinAndSelect('s.showtimeGenreEntity', 'sg')
      .leftJoinAndSelect('sg.genreEntity', 'g')
      .leftJoinAndSelect('s.showtimeLikeEntity', 'sl')
      .where('s.id = :showtimeId', {showtimeId: showtimeId})
      .getOne();

    if (!tierInfo) {
      const responseObj = new InfoNftDto();
      return responseObj;
    }

    const infoNftDto = new InfoNftDto();

    const entityManager = getManager();
    const streamObj = await entityManager.query(
      'select ceil(ifnull(sum(total_second)/?, 0)) as totalStreams from l2e where token_id in ' +
      '( ' +
      'select token_id from showtime_tier where showtime_id = ? ' +
      ')'
      , [Number(tierInfo.showtimeEntity.playTime), showtimeId]);

    infoNftDto.showtimeId = Number(showtimeId);
    infoNftDto.nftMusicId = Number(showtimeId);
    infoNftDto.title = tierInfo.showtimeEntity.title;
    infoNftDto.name = tierInfo.showtimeEntity.name;
    infoNftDto.artist = tierInfo.showtimeEntity.artist;
    infoNftDto.handle = tierInfo.showtimeEntity.handle;
    infoNftDto.description = tierInfo.showtimeEntity.description;
    infoNftDto.lyrics = tierInfo.showtimeEntity.lyrics;
    infoNftDto.playTime = tierInfo.showtimeEntity.playTime;
    infoNftDto.isLike = false;
    infoNftDto.tokenId = tierInfo.tokenId;
    infoNftDto.source = 'showtime';
    infoNftDto.playCount = streamObj[0].totalStreams;
    infoNftDto.likeCount = tierInfo.showtimeEntity.showtimeLikeEntity.length;
    infoNftDto.releaseDt = Formatter.dateFormatter(tierInfo.showtimeEntity.createdAt);

    for(const showtimeFileEntity of tierInfo.showtimeFileEntity) {
      switch (showtimeFileEntity.fileType) {
        case 'MUSIC':
          infoNftDto.musicFileUrl = showtimeFileEntity.fileEntity.url;
          break;
        case 'IMAGE':
          infoNftDto.imgFileUrl = showtimeFileEntity.fileEntity.url;
          break;
      }
    }
    let genres = '';
    for(const showtimeGenreEntity of tierInfo.showtimeEntity.showtimeGenreEntity) {
      genres += showtimeGenreEntity.genreEntity.name + ', '
    }

    infoNftDto.genres = genres.substring(0, genres.length-2);

    return infoNftDto;
  }
}
