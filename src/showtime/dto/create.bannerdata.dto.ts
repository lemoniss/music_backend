import { IsOptional } from "class-validator";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class CreateBannerDataDto {

  @IsOptional()
  lang: string;

  @IsOptional()
  title: string;

  @IsOptional()
  subTitle: string;

  @IsOptional()
  contents: string;

  @IsOptional()
  fileId: number;

  @IsOptional()
  viewYn: string;

  @IsOptional()
  order: number;

  @IsOptional()
  host: string;

  @IsOptional()
  eventAt: string;

  @IsOptional()
  location: string;

  @IsOptional()
  btnText: string;

  @IsOptional()
  type: string;

  @IsOptional()
  extra: string;
}
