import { ApiProperty } from "@nestjs/swagger";
import { UserSnsDto } from "./UserSnsDto";

export class InfoUserDto {

  @ApiProperty({
    name: 'id',
    description: '유저 식별자',
    required: true,
    example: '1',
  })
  id: number;

  @ApiProperty({
    name: 'address',
    description: '지갑주소',
    required: true,
    example: '0x1234....',
  })
  address: string; // 지갑주소

  @ApiProperty({
    name: 'nickname',
    description: '닉네임',
    required: true,
    example: '홍길동',
  })
  nickname: string; // 닉네임

  @ApiProperty({
    name: 'handle',
    description: '핸들',
    required: true,
    example: '@maxx',
  })
  handle: string; // 핸들

  @ApiProperty({
    name: 'introduce',
    description: '내 소개글',
    required: true,
    example: '안녕하세요',
  })
  introduce: string; // 내 소개글

  @ApiProperty({
    name: 'profileImgUrl',
    description: '프로필이미지URL',
    required: false,
    example: 'http://image.......',
  })
  profileImgUrl: string; // 프로필이미지URL

  bannerImgUrl: string;

  @ApiProperty({
    name: 'genreIds',
    description: '내 장르들 index',
    required: false,
    example: '[1,2,3]',
  })
  genreIds: number[];

  genres: string;  // 장르 파싱한 데이터

  userSns: UserSnsDto[];

  @ApiProperty({
    name: 'createAt',
    description: '가입일',
    required: false,
    example: '2022-01-01 01:01:01',
  })
  createAt: string;
}
