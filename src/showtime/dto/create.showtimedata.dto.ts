import { IsOptional } from "class-validator";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class CreateShowTimeDataDto {

  @IsOptional()
  name: string;

  @IsOptional()
  artist: string;

  @IsOptional()
  title: string;

  @IsOptional()
  handle: string;

  @IsOptional()
  genreIds: number[];

  @IsOptional()
  description: string;

  @IsOptional()
  musicFileId: number;

  @IsOptional()
  playTime: number;

  @IsOptional()
  imageFileId: number;

  @IsOptional()
  rares: InfoRareDto[];

  @IsOptional()
  releaseStartAt: string;

  @IsOptional()
  releaseEndAt: string;

  @IsOptional()
  releaseYn: string;

  @IsOptional()
  distributors: InfoDistributorDto[];

  @IsOptional()
  no: number;

  @IsOptional()
  tier: string;

  @IsOptional()
  price: number;

  @IsOptional()
  ipfsHash: string;

  @IsOptional()
  tokenId: string;

  @IsOptional()
  startTokenId: string;

  @IsOptional()
  lastTokenId: string;

  @IsOptional()
  tierDescription: string;

  @IsOptional()
  transactionHash: string;

  @IsOptional()
  lyrics: string;

  @IsOptional()
  goldCount: number;

  @IsOptional()
  goldPrice: number;

  @IsOptional()
  goldImageFileId: number;

  @IsOptional()
  goldDescription: string;

  @IsOptional()
  goldRares: InfoRareDto[];

  @IsOptional()
  platinumCount: number;

  @IsOptional()
  platinumPrice: number;

  @IsOptional()
  platinumImageFileId: number;

  @IsOptional()
  platinumDescription: string;

  @IsOptional()
  platinumRares: InfoRareDto[];

  @IsOptional()
  diamondCount: number;

  @IsOptional()
  diamondPrice: number;

  @IsOptional()
  diamondImageFileId: number;

  @IsOptional()
  diamondDescription: string;

  @IsOptional()
  diamondRares: InfoRareDto[];

  @IsOptional()
  showTimeId: string;

  @IsOptional()
  tierType: number[];

  @IsOptional()
  mintCount: number[];

  @IsOptional()
  sellPrices: number[];
}
