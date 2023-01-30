import { IsOptional } from "class-validator";

export class InfoRareDto {

  @IsOptional()
  no: number;

  @IsOptional()
  imageFileIds: number[];

  @IsOptional()
  imageIpfsHash: string[];
}
