import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserFollowerDto {

  @IsNumber()
  @IsNotEmpty()
  followerId: number;

}
