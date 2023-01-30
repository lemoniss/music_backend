import { IsNotEmpty, isNotEmpty, IsNumber, isNumber, IsNumberString, IsOptional, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserSnsDto } from "./UserSnsDto";

export class UpdateUserDto {

  @ApiProperty({
    name: 'nickname',
    description: '닉네임',
    required: false,
    example: '홍길동',
  })
  @MaxLength(20)
  nickname: string; // 닉네임

  @ApiProperty({
    name: 'introduce',
    description: '내 소개글',
    required: false,
    example: '안녕하세요',
  })
  @MaxLength(100)
  introduce: string; // 내 소개글

  @ApiProperty({
    name: 'handle',
    description: '핸들',
    required: false,
    example: '@maxx',
  })
  @MaxLength(20)
  handle: string; // 핸들

  @ApiProperty({
    name: 'fileId',
    description: '내 프로필사진ID',
    required: false,
    example: '1',
  })
  @IsOptional()
  fileId: number; // 내 프로필사진ID (nullable)

  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: true,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];  // 장르ID

  @IsOptional()
  userSnsModels: UserSnsDto[];
}
