import { IsOptional } from "class-validator";
import { InfoRareDto } from "./info.rare.dto";
import { InfoDistributorDto } from "./info.distributor.dto";

export class CreateShowTimeCrewDto {

  @IsOptional()
  names: string[];

  @IsOptional()
  userIds: number[];

}
