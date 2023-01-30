import { IsOptional } from "class-validator";

export class CreateShowTimeLikeDto {

  @IsOptional()
  showtimeId: number;

  @IsOptional()
  userId: number;

}
