import { IsOptional } from "class-validator";

export class InfoDistributorDto {

  @IsOptional()
  distributorName: string;

  @IsOptional()
  distributorAddress: string;

  @IsOptional()
  distributorPer: number;
}
