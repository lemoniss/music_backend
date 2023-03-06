import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BulkLikeNftDto {

  @IsOptional()
  nftMusicId: number[];  // 음악생성 식별자

  @IsString()
  @IsNotEmpty()
  source: string;

}
