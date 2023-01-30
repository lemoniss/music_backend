import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ItemExchangeDto {

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
    name: 'exchangeId',
    description: '거래소아이템 ID',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  exchangeId: number;

  @IsString()
  @IsNotEmpty()
  source: string;
}
