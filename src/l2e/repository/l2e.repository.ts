import { EntityRepository, getConnection, getManager, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { L2eEntity } from "../entity/l2e.entity";
import { CreateL2eDto } from "../../nftmusic/dto/create.l2e.dto";
import { InfoStreamingTop10Dto } from "../dto/info.streaming.top10.dto";
import { UserExchangeEntity } from "../../exchange/entity/user_exchange.entity";

@EntityRepository(L2eEntity)
export class L2eRepository extends Repository<L2eEntity> {

  /**
   * nft이력 기록
   * @param createUserDto
   */
  async saveL2e(createL2eDto: CreateL2eDto) {
    try {
      // await this.save({
      //   userId: createL2eDto.userId,
      //   tokenId: createL2eDto.tokenId,
      //   totalSecond: createL2eDto.totalSecond,
      //   source: typeof createL2eDto.source == 'undefined' || createL2eDto.source == '' ? null : createL2eDto.source,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(L2eEntity)
        .values({
          userId: createL2eDto.userId,
          tokenId: createL2eDto.tokenId,
          totalSecond: createL2eDto.totalSecond,
          source: typeof createL2eDto.source == 'undefined' || createL2eDto.source == '' ? null : createL2eDto.source,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('saveL2e Server Error. Please try again later.');
    }
  }

  async getStreamingTop10(): Promise<InfoStreamingTop10Dto[]> {
    const entityManager = getManager();
    const l2eObj = await entityManager.query(
      'select t.token_id as tokenId, t.totalSecond, t.source ' +
      'from ( ' +
      ' select token_id, source, sum(total_second) as totalSecond ' +
      ' from l2e ' +
      ' where source != \'myMusic\' ' +
      ' group by token_id, source' +
      ') t ' +
      'order by t.totalSecond desc ' +
      'limit 10 ' );

    const response = [];

    if(l2eObj.length > 0) {
      for(let i= 0; i< l2eObj.length; i++) {
        const infoStreamingTop10Dto = new InfoStreamingTop10Dto();
        infoStreamingTop10Dto.tokenId = l2eObj[i].tokenId;
        infoStreamingTop10Dto.totalSecond = l2eObj[i].totalSecond;
        infoStreamingTop10Dto.source = l2eObj[i].source;
        response.push(infoStreamingTop10Dto);
      }
    }

    return response;
  }

  dateFormatter(pureDate) {
    function pad(n) { return n<10 ? "0"+n : n }
    return pureDate.getFullYear()+"-"+
      pad(pureDate.getMonth()+1)+"-"+
      pad(pureDate.getDate())+" "+
      pad(pureDate.getHours())+":"+
      pad(pureDate.getMinutes())+":"+
      pad(pureDate.getSeconds());
  }
}
