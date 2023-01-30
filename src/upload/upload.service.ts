import * as AWS from "aws-sdk";
import { Injectable, UploadedFile } from "@nestjs/common";
import { UploadRepository } from "./repository/upload.repository";
import { CreateUploadDto } from "./dto/create.upload.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { ResponseUploadDto } from "./dto/response.upload.dto";
import { MetadataNftDto } from "../nftmusic/dto/metadata.nft.dto";
import ipfsClient, { create, globSource, urlSource } from "ipfs-http-client";
import { ResponseBulkUploadDto } from "./dto/response.bulkupload.dto";
import { IpfsShowtimeDto } from "../showtime/dto/ipfs.showtime.dto";
import axios from "axios";
import { BaseUriRepository } from "./repository/baseuri.repository";
import { CreateBaseUriDto } from "./dto/create.baseuri.dto";
const fs = require('fs');

@Injectable()
export class UploadService {

  constructor(
    private uploadRepository: UploadRepository,
    private baseUriRepository: BaseUriRepository,) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadFileToS3(@UploadedFile() file): Promise<ResponseUploadDto> {

    let s3Filename = `${Date.now() + this.makeId() + file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length)}`;
    s3Filename = s3Filename.replace("'", "");

    try {
      await new AWS.S3()
        .putObject({
          Key: s3Filename.replace("'", ""),
          Body: file.buffer,
          Bucket: process.env.AWS_BUCKET
        })
        .promise();
    } catch (error) {
      throw new RuntimeException();
    }

    const s3Url = "https://" + process.env.AWS_BUCKET + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + s3Filename;

    const ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length).replace("'", "");

    const createUploadDto = new CreateUploadDto();
    createUploadDto.key = s3Filename;
    createUploadDto.name = file.originalname.replace("'", "");
    createUploadDto.url = s3Url;
    createUploadDto.ext = ext;

    const { getAudioDurationInSeconds } = require('get-audio-duration');

    if(ext == 'mp3' || ext == 'wav' || ext == 'flac') {
      createUploadDto.playTime = await getAudioDurationInSeconds(s3Url).then((duration) => {
        return Math.round(duration);
      });
    }

    const responseUploadDto = await this.uploadRepository.createFile(createUploadDto);
    responseUploadDto.fileName = file.originalname;
    return responseUploadDto;

    // TODO : S3 및 관계테이블에 있는 안쓰는 파일데이터를 삭제해야함. (나중에 배치로 처리함)
  }

  async uploadFileToIpfs(fileId: number): Promise<string> {

    const fileInfo = await this.uploadRepository.findFile(fileId);

    const auth = 'Basic ' + Buffer.from('2DCCRGDiu4Hhsj9g37xWt33Epk1' + ':' + 'e337091e00d403b9c409dd042d9353a1').toString('base64');

    const ipfsClient = require("ipfs-http-client");
    const ipfs = ipfsClient.create({
      host: process.env.IPFS_HOST,
      port: Number(process.env.IPFS_PORT),
      protocol: process.env.IPFS_PROTOCOL,
      headers: {
        authorization: auth,
      },
    });

    return await ipfs.add(urlSource(fileInfo.url)).then(result => {
      return result.cid.toString();
    });
  }

  async uploadMetadataToIpfs(metadataNftDto: MetadataNftDto): Promise<string> {
    const metadata = JSON.stringify({
      animation_url: 'https://millimx.infura-ipfs.io/ipfs/' + metadataNftDto.musicIpfsHash,
      audio_url: 'https://millimx.infura-ipfs.io/ipfs/' + metadataNftDto.musicIpfsHash,
      artist: metadataNftDto.artist,
      attributes: [
        {
          trait_type: "Artist",
          value: metadataNftDto.artist,
        },
      ],
      description: metadataNftDto.description,
      duration: metadataNftDto.playTime,
      image: 'https://millimx.infura-ipfs.io/ipfs/' + metadataNftDto.imageIpfsHash,
      name: metadataNftDto.name,
      title: metadataNftDto.title,
    });

    if(!fs.existsSync(process.env.IPFS_FILE_PATH)) {
      fs.mkdirSync(process.env.IPFS_FILE_PATH, {recursive: true});
    }

    fs.writeFileSync(process.env.IPFS_FILE_PATH+metadataNftDto.tokenId, metadata);

    return this.ipfsContentsChecker(metadataNftDto.tokenId);
  }

  async uploadShowtimeMetadataToIpfs(ipfsShowtimeDtos: IpfsShowtimeDto[], lastTokenId: string): Promise<string> {

    for(const ipfsShowtimeDto of ipfsShowtimeDtos) {
      let metadataObj: any = {};
      metadataObj.name = ipfsShowtimeDto.name;
      metadataObj.artist = ipfsShowtimeDto.artist;
      metadataObj.title = ipfsShowtimeDto.title;
      metadataObj.genres = ipfsShowtimeDto.genres;
      metadataObj.description = ipfsShowtimeDto.description;
      metadataObj.animation_url = 'https://millimx.infura-ipfs.io/ipfs/' + ipfsShowtimeDto.musicIpfsHash;
      metadataObj.audio_url = 'https://millimx.infura-ipfs.io/ipfs/' + ipfsShowtimeDto.musicIpfsHash;
      metadataObj.duration = ipfsShowtimeDto.playTime;

      let attributesArray: any = [];
      let attributeArtist: any = {};
      attributeArtist.trait_type = 'Artist';
      attributeArtist.value = ipfsShowtimeDto.artist;
      attributesArray.push(attributeArtist);
      let attributeTier: any = {};
      attributeTier.trait_type = 'Tier';
      attributeTier.value = ipfsShowtimeDto.tier;
      attributesArray.push(attributeTier);
      let attributeNumber: any = {};
      attributeNumber.display_type = 'number';
      attributeNumber.trait_type = 'Token Number';
      attributeNumber.value = ipfsShowtimeDto.no;
      attributesArray.push(attributeNumber);

      metadataObj.attributes = attributesArray;

      metadataObj.image = 'https://millimx.infura-ipfs.io/ipfs/' + ipfsShowtimeDto.imageIpfsHash;
      metadataObj.seller_fee_basis_points = ipfsShowtimeDto.royaltyPercent;
      metadataObj.payout_address = ipfsShowtimeDto.royaltyAddress;

      if(typeof ipfsShowtimeDto.rareImageIpfsHash != 'undefined') {
        let rareImageIpfsHashArray: any = [];
        for(const ipfsHash of ipfsShowtimeDto.rareImageIpfsHash) {
          rareImageIpfsHashArray.push('https://millimx.infura-ipfs.io/ipfs/' + ipfsHash);
        }
        metadataObj.rare_images = rareImageIpfsHashArray;
      }

      const metadata = JSON.stringify(metadataObj);

      if(!fs.existsSync(process.env.IPFS_FILE_PATH)) {
        fs.mkdirSync(process.env.IPFS_FILE_PATH, {recursive: true});
      }

      fs.writeFileSync(process.env.IPFS_FILE_PATH+ipfsShowtimeDto.tokenId, metadata);
    }

    return this.ipfsContentsChecker(lastTokenId);
  }

  makeId() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }


  /**
   * showtile bulk
   * @param files
   */
  async bulkUploadFileToS3(@UploadedFile() files): Promise<ResponseBulkUploadDto[]> {

    const responseList = [];
    for(let i= 0; i< 50; i++) {

      const bulkUploadDto = new ResponseBulkUploadDto();

      await this.uploadFileToS3(files.musicFile[0]).then(async (S3Result) => {
        bulkUploadDto.musicFileId = S3Result.fileId;
        bulkUploadDto.playTime = S3Result.playTime;
        await this.uploadFileToIpfs(S3Result.fileId).then((ipfsHash) => {
          bulkUploadDto.musicIpfsHash = ipfsHash;
        });
      });

      if(i == 20 || i == 37 || i == 45) {
        await this.uploadFileToS3(files.imageFile[1]).then(async (S3Result) => {
          bulkUploadDto.imgFileId = S3Result.fileId;
          await this.uploadFileToIpfs(S3Result.fileId).then((ipfsHash) => {
            bulkUploadDto.imgIpfsHash = ipfsHash;
          });
        });
      } else {
        await this.uploadFileToS3(files.imageFile[0]).then(async (S3Result) => {
          bulkUploadDto.imgFileId = S3Result.fileId;
          await this.uploadFileToIpfs(S3Result.fileId).then((ipfsHash) => {
            bulkUploadDto.imgIpfsHash = ipfsHash;
          });
        });
      }

      responseList.push(bulkUploadDto);
    }

    return responseList;
  }

  // async bulkUploadFileToS3(@UploadedFile() files): Promise<ResponseBulkUploadDto[]> {
  //
  //   const responseList = [];
  //   for(let i= 0; i<files.musicFile.length; i++) {
  //
  //     const bulkUploadDto = new ResponseBulkUploadDto();
  //
  //     await this.uploadFileToS3(files.musicFile[i]).then(async (S3Result) => {
  //       bulkUploadDto.musicFileId = S3Result.fileId;
  //       bulkUploadDto.playTime = S3Result.playTime;
  //       await this.uploadFileToIpfs(S3Result.fileId).then((ipfsHash) => {
  //         bulkUploadDto.musicIpfsHash = ipfsHash;
  //       });
  //     });
  //
  //     await this.uploadFileToS3(files.imageFile[i]).then(async (S3Result) => {
  //       bulkUploadDto.imgFileId = S3Result.fileId;
  //       await this.uploadFileToIpfs(S3Result.fileId).then((ipfsHash) => {
  //         bulkUploadDto.imgIpfsHash = ipfsHash;
  //       });
  //     });
  //
  //     responseList.push(bulkUploadDto);
  //   }
  //
  //   return responseList;
  // }


  async ipfsContentsChecker(lastTokenId: string): Promise<string> {

    // 기존 ipfs hash에서 json을 read 한 후에 download 한다
    // QmSEYXzc8Hrm1UDGJJAMKBSZswSnLDYEUChu31G9y8sYjC

    const baseUriInfo = await this.baseUriRepository.getLastBaseUri();
    let startTokenId = 1;
    if(baseUriInfo.uri == 'empty') {
      return await this.ipfsContentsUpload(lastTokenId);
    } else {
      startTokenId = Number(baseUriInfo.tokenId);
      for(let i= Number(startTokenId); i<= Number(lastTokenId); i++) {

        if(!fs.existsSync(process.env.IPFS_FILE_PATH+i)) {
          await axios.get(
            'https://millimx.infura-ipfs.io/ipfs/'+baseUriInfo.uri+'/' + i
          ).then((res) => {
            let data = JSON.stringify(res.data);
            fs.writeFileSync(process.env.IPFS_FILE_PATH+i, data);
            // return data;
          })
          .catch((err) => {
            console.log(err);
          });
        }
        // baseUriRepository
        if(i == Number(lastTokenId)) {
          return await this.ipfsContentsUpload(lastTokenId);
        }
      }
    }


  }

  async ipfsContentsUpload(tokenId: string): Promise<string> {
    const auth = 'Basic ' + Buffer.from('2DCCRGDiu4Hhsj9g37xWt33Epk1' + ':' + 'e337091e00d403b9c409dd042d9353a1').toString('base64');

    const { globSource, create} = require("ipfs-http-client");
    const ipfs = create({
      host: process.env.IPFS_HOST,
      port: Number(process.env.IPFS_PORT),
      protocol: process.env.IPFS_PROTOCOL,
      headers: {
        authorization: auth,
      },
    });

    let uri;
    let ipfsUri = process.env.IPFS_FILE_PATH;


    for await (const file of ipfs.addAll(globSource(ipfsUri.substring(0, ipfsUri.length-1), '**/*'), {wrapWithDirectory: true})) {
      // console.log(file)
      if(file.path == '') { // folder
        // console.log(file.cid.toString());
        uri = file.cid.toString();
        const createBaseUriDto = new CreateBaseUriDto();
        createBaseUriDto.uri = 'https://millimx.infura-ipfs.io/ipfs/' + uri + '/';
        createBaseUriDto.tokenId = tokenId;
        await this.baseUriRepository.saveBaseUri(createBaseUriDto);
      // } else {
      //   console.log(file.path);
      }
    }
    return uri;
  }
}
