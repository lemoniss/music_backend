import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNftDto {

  @ApiProperty({
    name: 'myMusicId',
    description: '내음원식별자',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  myMusicId: number;  // 내음원식별자

  @ApiProperty({
    name: 'tokenId',
    description: 'NFT식별자',
    required: false,
    example: '1',
  })
  @IsOptional()
  tokenId: string;

  @ApiProperty({
    name: 'tokenUri',
    description: 'tokenUri',
    required: false,
    example: '1',
  })
  @IsOptional()
  tokenUri: string;

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
