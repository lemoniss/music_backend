import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NftMusicGenreRepository } from "./repository/nftmusic_genre.repository";
import { NftMusicFileRepository } from "./repository/nftmusic_file.repository";
import { NftMusicService } from "./nftmusic.service";
import { NftMusicController } from "./nftmusic.controller";
import { NftMusicRepository } from "./repository/nftmusic.repository";
import { NftMusicLikeRepository } from "./repository/nftmusic_like.repository";
import { UserNftMusicRepository } from "./repository/user_nftmusic.repository";
import { MyMusicModule } from "../mymusic/mymusic.module";
import { UploadModule } from "../upload/upload.module";
import { UserModule } from "../user/user.module";
import { ShowtimeModule } from "../showtime/showtime.module";
import { NftHistoryRepository } from "./repository/nfthistory.repository";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { NftMusicEntity } from "./entity/nftmusic.entity";
import { NftMusicGenreEntity } from "./entity/nftmusic_genre.entity";
import { NftMusicFileEntity } from "./entity/nftmusic_file.entity";
import { UserNftMusicEntity } from "./entity/user_nftmusic.entity";
import { NftMusicLikeEntity } from "./entity/nftmusic_like.entity";
import { NftHistoryEntity } from "./entity/nfthistory.entity";
import { L2eEntity } from "../l2e/entity/l2e.entity";
import { MyMusicService } from "../mymusic/mymusic.service";
import { UploadService } from "../upload/upload.service";
import { ShowtimeService } from "../showtime/showtime.service";

@Module({
  imports: [
    UserModule,
    MyMusicModule,
    UploadModule,
    ShowtimeModule,
    TypeOrmModule.forFeature([
      NftMusicEntity,
      NftMusicGenreEntity,
      NftMusicFileEntity,
      UserNftMusicEntity,
      NftMusicLikeEntity,
      NftHistoryEntity,
      L2eEntity,
    ]),
  ],
  controllers: [NftMusicController],
  providers: [
    NftMusicService,
    NftMusicRepository,
    NftMusicGenreRepository,
    NftMusicFileRepository,
    UserNftMusicRepository,
    NftMusicLikeRepository,
    NftHistoryRepository,
    L2eRepository,
    MyMusicModule,
    UploadModule,
    ShowtimeModule,
  ],
  exports: [TypeOrmModule, NftMusicService]
})
export class NftMusicModule {}
