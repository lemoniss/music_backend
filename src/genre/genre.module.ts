import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenreRepository } from "./repository/genre.repository";
import { GenreService } from "./genre.service";
import { GenreController } from "./genre.controller";
import { UserModule } from "../user/user.module";
import { GenreEntity } from "./entity/genre.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([GenreEntity])
  ], //L2eRepository 등록
  controllers: [GenreController],
  providers: [GenreService, GenreRepository],
  exports: [TypeOrmModule, GenreService],
})
export class GenreModule {}
