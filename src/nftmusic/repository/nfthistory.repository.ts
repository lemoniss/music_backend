import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { NftHistoryEntity } from "../entity/nfthistory.entity";
import { NftHistoryDto } from "../dto/nfthistory.dto";
import { NftMusicEntity } from "../entity/nftmusic.entity";
import { UserEntity } from "../entity/user.entity";
import { InfoNftHistoryDto } from "../dto/info.nfthistory.dto";
import { InfoNftDto } from "../dto/info.nft.dto";
import { NftProvenanceDto } from "../dto/nft.provenance.dto";
import { L2eEntity } from "../../l2e/entity/l2e.entity";
import { Formatter } from "../../util/formatter";

@EntityRepository(NftHistoryEntity)
export class NftHistoryRepository extends Repository<NftHistoryEntity> {

  /**
   * nft이력 기록
   * @param createUserDto
   */
  async saveHistory(nftHistoryDto: NftHistoryDto) {
    try {
      // await this.save({
      //   txHash: nftHistoryDto.txHash,
      //   status: nftHistoryDto.status,
      //   blockNumber: nftHistoryDto.blockNumber,
      //   tokenId: typeof nftHistoryDto.tokenId == 'undefined' ? "": nftHistoryDto.tokenId,
      //   fromAddress: nftHistoryDto.fromAddress,
      //   toAddress: typeof nftHistoryDto.toAddress == 'undefined' ? "": nftHistoryDto.toAddress,
      //   symbol: typeof nftHistoryDto.symbol == 'undefined' ? "": nftHistoryDto.symbol,
      //   price: typeof nftHistoryDto.price == 'undefined' ? "": nftHistoryDto.price,
      //   method: nftHistoryDto.method,
      //   extra: typeof nftHistoryDto.extra == 'undefined' ? "": nftHistoryDto.extra,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(NftHistoryEntity)
        .values({
          txHash: nftHistoryDto.txHash,
          status: nftHistoryDto.status,
          blockNumber: nftHistoryDto.blockNumber,
          tokenId: typeof nftHistoryDto.tokenId == 'undefined' ? "": nftHistoryDto.tokenId,
          fromAddress: nftHistoryDto.fromAddress,
          toAddress: typeof nftHistoryDto.toAddress == 'undefined' ? "": nftHistoryDto.toAddress,
          symbol: typeof nftHistoryDto.symbol == 'undefined' ? "": nftHistoryDto.symbol,
          price: typeof nftHistoryDto.price == 'undefined' ? "": nftHistoryDto.price,
          method: nftHistoryDto.method,
          extra: typeof nftHistoryDto.extra == 'undefined' ? "": nftHistoryDto.extra,
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('saveHistory Server Error. Please try again later.');
    }
  }

  async getNftHistoryInTokenId(tokenId: String): Promise<NftProvenanceDto[]> {
    try {

      const entityManager = getManager();
      const provenances = await entityManager.query(
  "select " +
        "f.url as userImage, " +
        "u.id as userId, " +
        "u.handle as userHandle, " +
        "h.method, " +
        "h.price, " +
        "h.boughtAt, " +
        "h.symbol " +
        "from " +
        "( " +
        "select " +
        "id, " +
        "token_id, " +
        "method, " +
        "price, " +
        "create_at as boughtAt, " +
        "case when method = 'mint' then from_address " +
        "else to_address " +
        "end as address, " +
        "symbol " +
        "from nft_history " +
        "where method in ('purchase','mint','gift') " +
        ") h " +
        "left join user u " +
        "on h.address = u.address " +
        "left join user_file uf " +
        "on u.id = uf.user_id " +
        "left join file f " +
        "on uf.file_id = f.id " +
        "where h.token_id = ? " +
        "order by h.id desc ", [tokenId]);

      const nftProvenanceDtos = [];

      if(provenances.length == 0) {
        // const nftProvenanceDto = new NftProvenanceDto();
        // nftProvenanceDtos.push(nftProvenanceDto);
        return nftProvenanceDtos;
      }

      for(let i=0; i< provenances.length; i++) {
        const nftProvenanceDto = new NftProvenanceDto();
        nftProvenanceDto.userId = provenances[i].userId;
        nftProvenanceDto.userImage = provenances[i].userImage;
        nftProvenanceDto.userHandle = provenances[i].userHandle;
        nftProvenanceDto.method = provenances[i].method;
        nftProvenanceDto.price = provenances[i].price;
        nftProvenanceDto.boughtAt = Formatter.dateFormatter(provenances[i].boughtAt);
        nftProvenanceDto.symbol = provenances[i].symbol;
        nftProvenanceDtos.push(nftProvenanceDto);
      }
      return nftProvenanceDtos;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getNftHistoryInAddress(address: string): Promise<InfoNftHistoryDto[]> {
    try {

      const entityManager = getManager();
      const historyList = await entityManager.query(
        "select " +
        "ifnull(f.showtime_name, f.normal_name) as name, " +
        "ifnull(f.showtime_url, f.normal_url) as url, " +
        "f.id, " +
        "f.symbol, " +
        "f.tokenId, " +
        "f.price, " +
        "f.fromAddress, " +
        "f.toAddress, " +
        "f.createdAt, " +
        "f.txHash, " +
        "f.status, " +
        "f.blockNumber, " +
        "f.method " +
        "from " +
        "( " +
        "select " +
        "( " +
        "select " +
        "name " +
        "from " +
        "showtime_tier " +
        "where " +
        "token_id = t.token_id) as showtime_name, " +
        "( " +
        "select f.url from showtime_tier st " +
        "left join showtime_file sf  " +
        "on st.id = sf.showtime_tier_id  " +
        "and sf.file_type = 'IMAGE' " +
        "left join file f  " +
        "on sf.file_id = f.id  " +
        "where st.token_id=t.token_id " +
        ") as showtime_url, " +
        "( " +
        "select " +
        "name " +
        "from " +
        "nft_music " +
        "where " +
        "token_id = t.token_id " +
        "and source != 'catalog') as normal_name, " +
        "( " +
        "select f.url from nft_music n  " +
        "left join nft_music_file nf  " +
        "on n.id = nf.nft_music_id  " +
        "and nf.file_type = 'IMAGE' " +
        "left join file f " +
        "on nf.file_id = f.id " +
        "where n.token_id=t.token_id and n.source != 'catalog' " +
        ") as normal_url, " +
        "t.id, " +
        "t.symbol, " +
        "t.token_id as tokenId, " +
        "t.price, " +
        "t.from_address as fromAddress, " +
        "t.to_address as toAddress, " +
        "t.create_at as createdAt, " +
        "t.tx_hash as txHash, " +
        "t.status, " +
        "t.block_number as blockNumber, " +
        "t.method " +
        "from " +
        "nft_history t " +
        "where " +
        "t.from_address = ? " +
        "or t.to_address = ? " +
        "order by t.id desc  " +
        ") f", [address, address]);

      const infoNftHistoryDtos = [];

      if(historyList.length == 0) {
          // const infoNftHistoryDto = new InfoNftHistoryDto();
          // infoNftHistoryDtos.push(infoNftHistoryDto);
          return infoNftHistoryDtos;
      }

      for(let i=0; i< historyList.length; i++) {
        const infoNftHistoryDto = new InfoNftHistoryDto();
        infoNftHistoryDto.id = Number(historyList[i].id);
        infoNftHistoryDto.symbol = historyList[i].symbol;
        infoNftHistoryDto.tokenId = historyList[i].tokenId;
        infoNftHistoryDto.price = historyList[i].price;
        infoNftHistoryDto.fromAddress = historyList[i].fromAddress;
        infoNftHistoryDto.toAddress = historyList[i].toAddress;
        infoNftHistoryDto.timestamp = Formatter.dateFormatter(historyList[i].createdAt);
        infoNftHistoryDto.txHash = historyList[i].txHash;
        infoNftHistoryDto.status = historyList[i].status;
        infoNftHistoryDto.blockNumber = historyList[i].blockNumber;
        infoNftHistoryDto.method = historyList[i].method;
        infoNftHistoryDto.name = historyList[i].name;
        infoNftHistoryDto.url = historyList[i].url;
        infoNftHistoryDtos.push(infoNftHistoryDto);
      }
      return infoNftHistoryDtos;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getNftHistoryDetail(id: number): Promise<InfoNftHistoryDto> {
    try {

      const entityManager = getManager();
      const history = await entityManager.query(
        "select " +
        "ifnull(f.showtime_name, f.normal_name) as name, " +
        "ifnull(f.showtime_url, f.normal_url) as url, " +
        "f.id, " +
        "f.symbol, " +
        "f.tokenId, " +
        "f.price, " +
        "f.fromAddress, " +
        "f.toAddress, " +
        "f.createdAt, " +
        "f.txHash, " +
        "f.status, " +
        "f.blockNumber, " +
        "f.method " +
        "from " +
        "( " +
        "select " +
        "( " +
        "select " +
        "name " +
        "from " +
        "showtime_tier " +
        "where " +
        "token_id = t.token_id) as showtime_name, " +
        "( " +
        "select f.url from showtime_tier st " +
        "left join showtime_file sf  " +
        "on st.id = sf.showtime_tier_id  " +
        "and sf.file_type = 'IMAGE' " +
        "left join file f  " +
        "on sf.file_id = f.id  " +
        "where st.token_id=t.token_id " +
        ") as showtime_url, " +
        "( " +
        "select " +
        "name " +
        "from " +
        "nft_music " +
        "where " +
        "token_id = t.token_id " +
        "and source != 'catalog') as normal_name, " +
        "( " +
        "select f.url from nft_music n  " +
        "left join nft_music_file nf  " +
        "on n.id = nf.nft_music_id  " +
        "and nf.file_type = 'IMAGE' " +
        "left join file f " +
        "on nf.file_id = f.id " +
        "where n.token_id=t.token_id and n.source != 'catalog' " +
        ") as normal_url, " +
        "t.id, " +
        "t.symbol, " +
        "t.token_id as tokenId, " +
        "t.price, " +
        "t.from_address as fromAddress, " +
        "t.to_address as toAddress, " +
        "t.create_at as createdAt, " +
        "t.tx_hash as txHash, " +
        "t.status, " +
        "t.block_number as blockNumber, " +
        "t.method " +
        "from " +
        "nft_history t " +
        "where " +
        "t.id = ? " +
        ") f", [id]);

      if(!history) {
        const infoNftHistoryDto = new InfoNftHistoryDto();
        return infoNftHistoryDto;
      }

      const infoNftHistoryDto = new InfoNftHistoryDto();
      infoNftHistoryDto.id = Number(history[0].id);
      infoNftHistoryDto.symbol = history[0].symbol;
      infoNftHistoryDto.tokenId = history[0].tokenId;
      infoNftHistoryDto.price = history[0].price;
      infoNftHistoryDto.fromAddress = history[0].fromAddress;
      infoNftHistoryDto.toAddress = history[0].toAddress;
      infoNftHistoryDto.timestamp = Formatter.dateFormatter(history[0].createdAt);
      infoNftHistoryDto.txHash = history[0].txHash;
      infoNftHistoryDto.status = history[0].status;
      infoNftHistoryDto.blockNumber = history[0].blockNumber;
      infoNftHistoryDto.method = history[0].method;
      infoNftHistoryDto.name = history[0].name;
      infoNftHistoryDto.url = history[0].url;
      return infoNftHistoryDto;

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
