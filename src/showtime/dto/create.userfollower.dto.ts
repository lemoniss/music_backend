import { IsOptional } from "class-validator";

export class CreateUserFollowerDto {

  @IsOptional()
  followerId: number;

  @IsOptional()
  userId: number;

}
