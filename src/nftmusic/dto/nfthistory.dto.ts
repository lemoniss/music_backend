import { IsNotEmpty, IsOptional } from "class-validator";

export class NftHistoryDto {

  @IsNotEmpty()
  txHash: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  blockNumber: string;

  @IsOptional()
  tokenId: string;

  @IsNotEmpty()
  fromAddress: string;

  @IsOptional()
  toAddress: string;

  @IsOptional()
  symbol: string;

  @IsOptional()
  price: string;

  @IsNotEmpty()
  method: string;

  @IsOptional()
  extra: string;
}
