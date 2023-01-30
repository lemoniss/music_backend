import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindByUserNftDto {

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
  @IsNotEmpty()
  sortType: string;

  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: true,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];  // 장르ID

  @ApiProperty({
    name: 'userId',
    description: '유저의 DB index, 플레이리스트를 가진 유저',
    required: true,
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    name: 'targetUserId',
    description: '유저의 DB index, isLike 호출할 유저',
    required: true,
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @IsOptional()
  device: string;  // device
}
