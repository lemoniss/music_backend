import { EntityRepository, getConnection, getManager, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { L2eEntity } from "../entity/l2e.entity";
import { CreateL2eDto } from "../../nftmusic/dto/create.l2e.dto";
import { InfoStreamingTopDto } from "../dto/info.streaming.top.dto";
import { SortNftDto } from "../../nftmusic/dto/sort.nft.dto";

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

  async getStreamingTop(sortNftDto: SortNftDto): Promise<InfoStreamingTopDto[]> {

    let genreIds: string = '';

    if(typeof sortNftDto.genreIds != 'undefined' && sortNftDto.genreIds.length > 0) {
      for(const genreId of sortNftDto.genreIds) {
        genreIds = genreIds + genreId + ','
      }
      genreIds = genreIds.substring(0, genreIds.length-1);
    }

    let genreQuery: string = '';
    if(genreIds != '') {
      genreQuery = ' and ng.genre_id in (' + genreIds + ') ';
    }

    const entityManager = getManager();
    const l2eObj = await entityManager.query(
      'select r.tokenId, r.totalSecond, r.source, r.id from (' +
      'select t.token_id as tokenId, t.totalSecond, t.source, t.id ' +
      '      from ( ' +
      '       select token_id, source, sum(total_second) as totalSecond, max(id) as id ' +
      '       from l2e ' +
      '       where source != \'myMusic\' ' +
      '       group by token_id, source' +
      '      ) t ' +
      '      inner join showtime_tier st' +
      '      on t.token_id = st.token_id' +
      '      and t.source = \'showtime\'' +
      '      inner join showtime_genre ng' +
      '      on st.showtime_id = ng.showtime_id  ' +
      genreQuery +
      '      union all ' +
      'select t.token_id as tokenId, t.totalSecond, t.source, t.id ' +
      '      from ( ' +
      '       select token_id, source, sum(total_second) as totalSecond, max(id) as id ' +
      '       from l2e ' +
      '       where source != \'myMusic\' ' +
      '       group by token_id, source' +
      '      ) t ' +
      '      inner join nft_music n' +
      '      on t.token_id = n.token_id' +
      '      and t.source != \'showtime\'' +
      '      inner join nft_music_genre ng' +
      '      on ng.nft_music_id = n.id' +
      genreQuery +
      ') r      ' +
      'group by r.tokenId, r.totalSecond, r.source, r.id ' +
      'order by r.totalSecond desc ' +
      'limit ? offset ? ', [sortNftDto.take, sortNftDto.skip] );

    const response = [];

    if(l2eObj.length > 0) {
      for(let i= 0; i< l2eObj.length; i++) {
        const infoStreamingTopDto = new InfoStreamingTopDto();
        infoStreamingTopDto.tokenId = l2eObj[i].tokenId;
        infoStreamingTopDto.totalSecond = l2eObj[i].totalSecond;
        infoStreamingTopDto.source = l2eObj[i].source;
        response.push(infoStreamingTopDto);
      }
    }

    return response;
  }

  async getRecentPlayed(sortNftDto: SortNftDto): Promise<InfoStreamingTopDto[]> {

    let genreIds: string = '';

    if(typeof sortNftDto.genreIds != 'undefined' && sortNftDto.genreIds.length > 0) {
      for(const genreId of sortNftDto.genreIds) {
        genreIds = genreIds + genreId + ','
      }
      genreIds = genreIds.substring(0, genreIds.length-1);
    }

    let genreQuery: string = '';
    if(genreIds != '') {
      genreQuery = ' and ng.genre_id in (' + genreIds + ') ';
    }

    const entityManager = getManager();

    const l2eObj = await entityManager.query(
      'select r.tokenId, r.totalSecond, r.source, r.id from (' +
      'select t.token_id as tokenId, t.totalSecond, t.source, t.id ' +
      '      from ( ' +
      '       select token_id, source, sum(total_second) as totalSecond, max(id) as id ' +
      '       from l2e ' +
      '       where user_id = ? ' +
      '       and source != \'myMusic\' ' +
      '       group by token_id, source' +
      '      ) t ' +
      '      inner join showtime_tier st' +
      '      on t.token_id = st.token_id' +
      '      and t.source = \'showtime\'' +
      '      inner join showtime_genre ng' +
      '      on st.showtime_id = ng.showtime_id  ' +
      genreQuery +
      '      union all ' +
      'select t.token_id as tokenId, t.totalSecond, t.source, t.id ' +
      '      from ( ' +
      '       select token_id, source, sum(total_second) as totalSecond, max(id) as id ' +
      '       from l2e ' +
      '       where user_id = ? ' +
      '       and source != \'myMusic\' ' +
      '       group by token_id, source' +
      '      ) t ' +
      '      inner join nft_music n' +
      '      on t.token_id = n.token_id' +
      '      and t.source != \'showtime\'' +
      '      inner join nft_music_genre ng' +
      '      on ng.nft_music_id = n.id' +
      genreQuery +
      ') r      ' +
      'group by r.tokenId, r.totalSecond, r.source, r.id ' +
      'order by r.id desc ' +
      'limit ? offset ? ', [sortNftDto.userId, sortNftDto.userId, sortNftDto.take, sortNftDto.skip] );

    const response = [];

    if(l2eObj.length > 0) {
      for(let i= 0; i< l2eObj.length; i++) {
        const infoStreamingTopDto = new InfoStreamingTopDto();
        infoStreamingTopDto.tokenId = l2eObj[i].tokenId;
        infoStreamingTopDto.totalSecond = l2eObj[i].totalSecond;
        infoStreamingTopDto.source = l2eObj[i].source;
        response.push(infoStreamingTopDto);
      }
    }

    return response;
  }
}
