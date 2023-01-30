import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class PurchaseShowtimeDto {

  @ApiProperty({
    name: 'userId',
    description: '사용자 식별자',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    name: 'showTimeTierId',
    description: '쇼타임티어 식별자',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  showTimeTierId: number;

  @IsOptional()
  symbol: string;
}
