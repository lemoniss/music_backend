import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PatchLikeNftDto {

  @IsNumber()
  @IsNotEmpty()
  nftMusicId: number;  // 음악생성 식별자

  @IsString()
  @IsNotEmpty()
  source: string;

}
