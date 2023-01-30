import { Controller, Get, UseGuards } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guard/auth.guard";
import { InfoGenreDto } from "./dto/info.genre.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
@UseGuards(AuthGuard)
@Controller("genres")
export class GenreController {

  constructor(private readonly genreService: GenreService) {}

  @ApiOperation({summary: '장르목록 조회'})
  @Get()
  getGenreAll(): Promise<InfoGenreDto[]> {
    return this.genreService.getGenreAll();
  }
}
