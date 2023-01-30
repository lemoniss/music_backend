import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreRepository } from "./repository/genre.repository";
import { InfoGenreDto } from "./dto/info.genre.dto";

@Injectable()
export class GenreService {
  constructor(
    private genreRepository: GenreRepository,
  ) {}

  async getGenreAll(): Promise<InfoGenreDto[]> {
    const infoGenres = [];

    const genreEntitys = await this.genreRepository.findAll();

    for(const genreEntity of genreEntitys) {
      const infoGenre = new InfoGenreDto();
      infoGenre.id = genreEntity.id;
      infoGenre.name = genreEntity.name;

      infoGenres.push(infoGenre);
    }

    return infoGenres;
  }

  async getGenreInfo(genreId: number): Promise<InfoGenreDto> {
    const genreEntity = await this.genreRepository.getGenreInfo(genreId);

    const infoGenre = new InfoGenreDto();
    infoGenre.id = genreEntity.id;
    infoGenre.name = genreEntity.name;

    return infoGenre;
  }
}
