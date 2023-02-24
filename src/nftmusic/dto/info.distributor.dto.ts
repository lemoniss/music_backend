import { IsOptional } from "class-validator";

export class InfoDistributorDto {

  @IsOptional()
  address: string;

  @IsOptional()
  percent: number;
}
