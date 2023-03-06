import { IsOptional } from "class-validator";
import { PatchLikeNftDto } from "./patchlike.nft.dto";

export class BulkLikeNftDto {

  @IsOptional()
  bulkLikeNfts: PatchLikeNftDto[];  // 음악생성 식별자

}
