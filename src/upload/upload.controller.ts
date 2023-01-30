import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { ResponseUploadDto } from "./dto/response.upload.dto";
import { AuthGuard } from "../guard/auth.guard";
import { ApiConsumes, ApiHeader, ApiOperation } from "@nestjs/swagger";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { ResponseBulkUploadDto } from "./dto/response.bulkupload.dto";
import { MetadataNftDto } from "../nftmusic/dto/metadata.nft.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
@UseGuards(AuthGuard)
@Controller('uploads')
export class UploadController {

  constructor(private readonly uploadService: UploadService) {}

  @Post('/s3')
  @ApiOperation({summary: 'S3 업로드'})
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({name: 'file', required: true, description: 'files to upload'})
  async uploadFile(@UploadedFile() file) : Promise<ResponseUploadDto> {
    return await this.uploadService.uploadFileToS3(file);
  }


  @Post('/ipfs/:fileId')
  @ApiOperation({summary: 'IPFS 업로드'})
  async uploadFileToIPFS(@Param("fileId", ParseIntPipe) fileId: number) : Promise<string> {
    const ipfsHash = await this.uploadService.uploadFileToIpfs(fileId);
    return Object.assign({ipfsHash: ipfsHash});
  }


  @Post('/bulk/s3')
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'musicFile', maxCount: 1},
    {name: 'imageFile'},
  ]))
  async bulkUploadFile(@UploadedFiles() files: {musicFile?: Express.Multer.File[], imageFile?: Express.Multer.File[]} )
  : Promise<ResponseBulkUploadDto[]> {
    return await this.uploadService.bulkUploadFileToS3(files);
  }

  @Post('/ipfs/mkdir/test')
  @ApiOperation({summary: 'IPFS 업로드'})
  async uploadFileToIPFSTest() : Promise<string> {
    const metadataNftDto = new MetadataNftDto();
    metadataNftDto.musicIpfsHash = 'musicIpfsHash';
    metadataNftDto.artist = 'artist777';
    metadataNftDto.description = 'desc777';
    metadataNftDto.playTime = 123;
    metadataNftDto.imageIpfsHash = 'imageIpfsHash';
    metadataNftDto.name = 'name777';
    metadataNftDto.title = 'title777';

    const ipfsHash = await this.uploadService.uploadMetadataToIpfs(metadataNftDto);
    return Object.assign({ipfsHash: ipfsHash});
  }
}
