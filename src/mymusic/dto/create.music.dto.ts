import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMusicDto {

  @ApiProperty({
    name: 'title',
    description: '앨범타이틀',
    required: true,
    example: '앨범타이틀',
  })
  @IsString()
  @IsNotEmpty()
  title: string; // 앨범타이틀

  @ApiProperty({
    name: 'name',
    description: '노래제목',
    required: true,
    example: '노래제목',
  })
  @IsString()
  @IsNotEmpty()
  name: string; // 노래제목

  @ApiProperty({
    name: 'artist',
    description: '아티스트',
    required: true,
    example: '아티스트',
  })
  @IsString()
  @IsNotEmpty()
  artist: string; // 아티스트

  @ApiProperty({
    name: 'handle',
    description: '핸들',
    required: true,
    example: 'handle',
  })
  @IsString()
  @IsNotEmpty()
  handle: string; // 아티스트

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
  description: string; // 설명

  @IsOptional()
  lyrics: string;

  @ApiProperty({
    name: 'musicFileId',
    description: '음악파일ID',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  musicFileId: number;  // 음악파일ID

  @ApiProperty({
    name: 'imgFileId',
    description: '앨범커버이미지ID',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  imgFileId: number;  // 앨범커버이미지ID

  @ApiProperty({
    name: 'playTime',
    description: '음원재생시간(초)',
    required: true,
    example: '270',
  })

  @IsNotEmpty()
  playTime: string; // playtime
}
