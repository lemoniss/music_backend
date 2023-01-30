import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { FileEntity } from "../entity/file.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateUploadDto } from "../dto/create.upload.dto";
import { ResponseUploadDto } from "../dto/response.upload.dto";
import { ExchangeEntity } from "../../exchange/entity/exchange.entity";

@EntityRepository(FileEntity)
export class UploadRepository extends Repository<FileEntity> {

  /**
   * 파일저장
   * @param createUploadDto
   */
  async createFile(createUploadDto: CreateUploadDto): Promise<ResponseUploadDto> {
    try {
      // const file = await this.save({
      //   name: createUploadDto.name,
      //   url: createUploadDto.url,
      //   ext: createUploadDto.ext,
      //   key: createUploadDto.key,
      //   viewYn: 'Y',
      // });

      const file = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(FileEntity)
        .values({
          name: createUploadDto.name,
          url: createUploadDto.url,
          ext: createUploadDto.ext,
          key: createUploadDto.key,
          viewYn: 'Y',
        })
        .execute();


      const response = new ResponseUploadDto();
      response.fileId = file.raw.insertId;
      response.playTime = createUploadDto.playTime;
      response.fileUrl = createUploadDto.url;
      return response;
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async findFile(fileId: number): Promise<CreateUploadDto> {
    try {
      const fileInfo = await getRepository(FileEntity)
        .createQueryBuilder('f')
        .where('f.id = :fileId', {fileId: fileId})
        .getOne();
      if(!fileInfo)
        throw new RuntimeException('file not found');

      const createUploadDto = new CreateUploadDto();
      createUploadDto.name = fileInfo.name;
      createUploadDto.url = fileInfo.url;
      createUploadDto.ext = fileInfo.ext;
      createUploadDto.key = fileInfo.key;
      return createUploadDto;
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
