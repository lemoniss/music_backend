import { EntityRepository, getRepository, Repository } from "typeorm";
import { GenreEntity } from "../entity/genre.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";

@EntityRepository(GenreEntity)
export class GenreRepository extends Repository<GenreEntity> {

  async findAll(): Promise<GenreEntity[]> {
    // return await this.find({
    //   order: {
    //     id: "ASC",
    //   }
    // });
    return await getRepository(GenreEntity)
      .createQueryBuilder('g')
      .orderBy('g.id', 'ASC')
      .getMany();
  }

  async getGenreInfo(genreId: number) : Promise<GenreEntity> {
    return await getRepository(GenreEntity)
      .createQueryBuilder('g')
      .where('g.id = :genreId', {genreId: genreId})
      .getOne();
  }
}
