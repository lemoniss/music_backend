import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { FileEntity } from "../entity/file.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateUploadDto } from "../dto/create.upload.dto";
import { ResponseUploadDto } from "../dto/response.upload.dto";
import { BaseUriEntity } from "../entity/base_uri.entity";
import { CreateBaseUriDto } from "../dto/create.baseuri.dto";
import { ResponseBaseUriDto } from "../dto/response.baseuri.dto";
import { NftMusicGenreEntity } from "../../showtime/entity/nftmusic_genre.entity";

@EntityRepository(BaseUriEntity)
export class BaseUriRepository extends Repository<BaseUriEntity> {

  /**
   * BaseUri 저장
   * @param createUploadDto
   */
  async saveBaseUri(createUploadDto: CreateBaseUriDto) {
    try {
      // await this.save({
      //   uri: createUploadDto.uri,
      //   tokenId: createUploadDto.tokenId,
      // });
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(BaseUriEntity)
        .values({
          uri: createUploadDto.uri,
          tokenId: createUploadDto.tokenId,
        })
        .execute();
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getLastBaseUri(): Promise<ResponseBaseUriDto> {
    try {
      const baseUriInfo = await getRepository(BaseUriEntity)
        .createQueryBuilder('b')
        .orderBy('b.id', 'DESC')
        .limit(1)
        .getOne();
      if(!baseUriInfo) {
        const responseBaseUriDto = new ResponseBaseUriDto();
        responseBaseUriDto.uri = 'empty';
        return responseBaseUriDto;
      }
        // throw new RuntimeException('baseUriInfo not found');
      const responseBaseUriDto = new ResponseBaseUriDto();
      responseBaseUriDto.uri = baseUriInfo.uri;
      responseBaseUriDto.tokenId = baseUriInfo.tokenId;
      return responseBaseUriDto;
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
