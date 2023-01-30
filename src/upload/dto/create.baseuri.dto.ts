import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBaseUriDto {
  @IsString()
  @IsNotEmpty()
  uri: string; // baseUri

  @IsString()
  @IsNotEmpty()
  tokenId: string;
}
