import { IsOptional } from "class-validator";

export class CreateBannerLikeDto {

  @IsOptional()
  bannerId: number;

  @IsOptional()
  userId: number;

}
