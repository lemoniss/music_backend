import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateShowTimeDtoBak {

  @ApiProperty({
    name: 'title',
    description: '앨범타이틀',
    required: true,
    example: '앨범타이틀',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string; // 앨범타이틀

  @ApiProperty({
    name: 'name',
    description: '노래제목',
    required: true,
    example: '노래제목',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string; // 노래제목

  @ApiProperty({
    name: 'artist',
    description: '아티스트',
    required: true,
    example: '아티스트',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  artist: string; // 아티스트

  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: true,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];  // 장르ID

  @ApiProperty({
    name: 'description',
    description: '설명',
    required: true,
    example: '설명',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string; // 설명

  @ApiProperty({
    name: 'musicFileIds',
    description: '음악파일ID',
    required: true,
    example: '[1,2,3,4]',
  })
  @IsOptional()
  musicFileIds: number[];  // 음악파일ID

  @ApiProperty({
    name: 'imgFileIds',
    description: '앨범커버이미지ID',
    required: true,
    example: '[1,2,3,4]',
  })
  @IsOptional()
  imgFileId: number[];  // 앨범커버이미지ID

  @ApiProperty({
    name: 'playTime',
    description: '음원재생시간(초)',
    required: true,
    example: '270',
  })
  @IsNumber()
  @IsNotEmpty()
  playTime: number; // playtime

  @ApiProperty({
    name: 'tokenId',
    description: 'NFT식별자',
    required: false,
    example: '1',
  })
  @IsOptional()
  tokenId: string;

  @ApiProperty({
    name: 'minter',
    description: '민팅한 사람 지갑주소',
    required: true,
    example: '0x123454...',
  })
  @IsString()
  @IsNotEmpty()
  minter: string;
}
