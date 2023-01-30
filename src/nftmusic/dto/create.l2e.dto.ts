import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateL2eDto {

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  tokenId: string;

  @IsNotEmpty()
  totalSecond: number;

  @IsOptional()
  source: string;
}
