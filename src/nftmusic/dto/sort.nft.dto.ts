import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SortNftDto {

  @ApiProperty({
    name: 'keyword',
    description: '검색 키워드; 필수 아님',
    required: true,
    example: '밀림',
  })
  @IsString()
  @IsOptional()
  keyword: string;  // 내음원식별자

  @ApiProperty({
    name: 'sortType',
    description: '정렬 유형',
    required: true,
    example: '인기순: play_count, 최신순: create_at, 좋아요 순: likes(추가 예정)',
  })
  @IsString()
  @IsOptional()
  sortType: string;

  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: true,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];  // 장르ID

  @IsOptional()
  userId: number;

  @IsOptional()
  device: string;  // device

  @IsOptional()
  take: number;

  @IsOptional()
  skip: number;

  @IsOptional()
  query: string;  // device
}
