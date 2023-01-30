import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GiftNftDto {

  @ApiProperty({
    name: 'nftMusicId',
    description: 'NFT음악 식별자',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  nftMusicId: number;  // 음악생성 식별자

  @ApiProperty({
    name: 'tokenId',
    description: 'tokenId',
    required: true,
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  tokenId: string;  // tokenId

  @ApiProperty({
    name: 'toUserId',
    description: 'toUserId',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  toUserId: number;  // toUserId

  @ApiProperty({
    name: 'source',
    description: 'source',
    required: true,
    example: 'showtime',
  })
  @IsString()
  @IsNotEmpty()
  source: string;  // source
}
