import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateExchangeDto {

  @ApiProperty({
    name: 'nftMusicId',
    description: 'nft식별자',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  nftMusicId: number;  // nft식별자

  @ApiProperty({
    name: 'itemId',
    description: '거래소 물품 ID',
    required: true,
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    name: 'seller',
    description: '판매자 지갑주소',
    required: true,
    example: '0x123454...',
  })
  @IsString()
  @IsNotEmpty()
  seller: string;

  @ApiProperty({
    name: 'price',
    description: '판매가격',
    required: true,
    example: '1000000',
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    name: 'source',
    description: '출처',
    required: true,
    example: 'showtime',
  })
  @IsString()
  @IsNotEmpty()
  source: string;
}
