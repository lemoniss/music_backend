import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class ResponsePurchasehistoryDto {

  userId: number;

  userImage: string;

  userHandle: string;

  boughtTier: string;

  boughtPrice: number;

  boughtAt: string;

  symbol: string;
}
