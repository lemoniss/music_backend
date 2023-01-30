import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class CreateShowTimeDto {

  @ApiProperty({
    name: 'name',
    description: '노래제목',
    required: true,
    example: '노래제목',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    name: 'artist',
    description: '아티스트',
    required: true,
    example: '아티스트',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  artist: string;

  @ApiProperty({
    name: 'title',
    description: '앨범타이틀',
    required: true,
    example: '앨범타이틀',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    name: 'handle',
    description: 'handle',
    required: true,
    example: 'handle',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  handle: string;

  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: true,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];

  @IsOptional()
  genres: string;

  @ApiProperty({
    name: 'description',
    description: '설명',
    required: true,
    example: '설명',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    name: 'musicFileId',
    description: '음악파일ID',
    required: true,
    example: '1',
  })
  @IsOptional()
  musicFileId: number;

  @IsOptional()
  musicFileIpshHash: string;

  @ApiProperty({
    name: 'playTime',
    description: '음원재생시간(초)',
    required: true,
    example: '270',
  })
  @IsNumber()
  @IsNotEmpty()
  playTime: number;


  @ApiProperty({
    name: 'goldCount',
    description: 'gold 발행갯수',
    required: true,
    example: '30',
  })
  @IsOptional()
  goldCount: number;

  @ApiProperty({
    name: 'goldPrice',
    description: 'gold 가격',
    required: true,
    example: '0.1',
  })
  @IsOptional()
  goldPrice: number;

  @ApiProperty({
    name: 'goldImageFileId',
    description: 'gold 기본이미지파일id',
    required: true,
    example: '1',
  })
  @IsOptional()
  goldImageFileId: number;

  @ApiProperty({
    name: 'goldDescription',
    description: 'gold 설명',
    required: true,
    example: 'gold 설명이 들어갑니다',
  })
  @IsOptional()
  goldDescription: string;

  @IsOptional()
  goldImageIpshHash: string;

  @ApiProperty({
    name: 'goldRares',
    description: 'gold rare 구성',
    required: true,
  })
  @IsOptional()
  goldRares: InfoRareDto[];

  @ApiProperty({
    name: 'platinumCount',
    description: 'platinum 발행갯수',
    required: true,
    example: '20',
  })
  @IsOptional()
  platinumCount: number;

  @ApiProperty({
    name: 'platinumPrice',
    description: 'platinum 가격',
    required: true,
    example: '0.3',
  })
  @IsOptional()
  platinumPrice: number;

  @ApiProperty({
    name: 'platinumImageFileId',
    description: 'platinum 기본이미지파일id',
    required: true,
    example: '1',
  })
  @IsOptional()
  platinumImageFileId: number;

  @ApiProperty({
    name: 'platinumDescription',
    description: 'platinum 설명',
    required: true,
    example: 'platinum 설명이 들어갑니다',
  })
  @IsOptional()
  platinumDescription: string;

  @IsOptional()
  platinumImageIpshHash: string;

  @ApiProperty({
    name: 'platinumRares',
    description: 'platinum rare 구성',
    required: true,
  })
  @IsOptional()
  platinumRares: InfoRareDto[];

  @ApiProperty({
    name: 'diamondCount',
    description: 'diamond 발행갯수',
    required: true,
    example: '10',
  })
  @IsOptional()
  diamondCount: number;

  @ApiProperty({
    name: 'diamondPrice',
    description: 'diamond 가격',
    required: true,
    example: '0.5',
  })
  @IsOptional()
  diamondPrice: number;

  @ApiProperty({
    name: 'diamondImageFileId',
    description: 'diamond 기본이미지파일id',
    required: true,
    example: '1',
  })
  @IsOptional()
  diamondImageFileId: number;

  @ApiProperty({
    name: 'diamondDescription',
    description: 'diamond 설명',
    required: true,
    example: 'diamond 설명이 들어갑니다',
  })
  @IsOptional()
  diamondDescription: string;

  @IsOptional()
  diamondImageIpshHash: string;

  @ApiProperty({
    name: 'diamondRares',
    description: 'diamond rare 구성',
    required: true,
  })
  @IsOptional()
  diamondRares: InfoRareDto[];

  @ApiProperty({
    name: 'releaseStartAt',
    description: '릴리즈일시',
    required: false,
    example: '2022-09-01 09:10:00',
  })
  @IsOptional()
  releaseStartAt: string;

  @ApiProperty({
    name: 'releaseEndAt',
    description: '릴리즈일시',
    required: false,
    example: '2022-09-01 09:10:00',
  })
  @IsOptional()
  releaseEndAt: string;

  @ApiProperty({
    name: 'releaseYn',
    description: '릴리즈여부',
    required: false,
    example: 'Y',
  })
  @IsOptional()
  releaseYn: string;

  @ApiProperty({
    name: 'distributors',
    description: '분배자들 구성',
    required: true,
  })
  @IsOptional()
  distributors: InfoDistributorDto[];

  @IsOptional()
  lyrics: string;
}
