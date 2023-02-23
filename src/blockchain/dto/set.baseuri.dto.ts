import { IsNotEmpty } from "class-validator";

export class SetBaseUriDto {

  @IsNotEmpty()
  baseUri: string;

}
