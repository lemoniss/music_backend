import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    name: 'address',
    description: '지갑주소',
    required: true,
    example: '0x1234....',
  })
  @IsString()
  @IsNotEmpty()
  address: string; // 지갑주소

  @ApiProperty({
    name: 'nickname',
    description: '닉네임',
    required: false,
    example: '홍길동',
  })
  @IsOptional()
  nickname: string; // 닉네임

  @ApiProperty({
    name: 'introduce',
    description: '내 소개글',
    required: false,
    example: '안녕하세요.',
  })
  @IsOptional()
  introduce: string; // 내 소개글

  @ApiProperty({
    name: 'lang',
    description: '언어',
    required: true,
    example: 'en',
  })
  @IsString()
  @IsNotEmpty()
  lang: string; // 언어

  @ApiProperty({
    name: 'nation',
    description: '국적',
    required: true,
    example: 'us',
  })
  @IsString()
  @IsNotEmpty()
  nation: string; // 국적

  @IsOptional()
  handle: string;

  @IsOptional()
  device: string;
}
