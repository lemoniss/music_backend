import { IsNotEmpty } from "class-validator";

export class ApproveDto {

  @IsNotEmpty()
  toAddress: string;

  @IsNotEmpty()
  tokenId: string;

}
