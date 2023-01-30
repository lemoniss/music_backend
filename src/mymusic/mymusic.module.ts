import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MyMusicService } from "./mymusic.service";
import { MyMusicController } from "./mymusic.controller";
import { MyMusicRepository } from "./repository/mymusic.repository";
import { MyMusicGenreRepository } from "./repository/mymusic_genre.repository";
import { MyMusicFileRepository } from "./repository/mymusic_file.repository";
import { UserModule } from "../user/user.module";
import { MyMusicEntity } from "./entity/mymusic.entity";
import { MyMusicGenreEntity } from "./entity/mymusic_genre.entity";
import { MyMusicFileEntity } from "./entity/mymusic_file.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      MyMusicEntity,
      MyMusicGenreEntity,
      MyMusicFileEntity
    ])
  ],
  controllers: [MyMusicController],
  providers: [
    MyMusicService,
    MyMusicRepository,
    MyMusicGenreRepository,
    MyMusicFileRepository
  ],
  exports: [TypeOrmModule, MyMusicService],
})
export class MyMusicModule {}
