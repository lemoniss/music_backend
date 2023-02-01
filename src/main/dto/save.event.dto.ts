import { IsNotEmpty } from "class-validator";

export class SaveEventDto {

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

}
