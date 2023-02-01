import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ShowtimeRepository } from "../showtime/repository/showtime.repository";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";
import { ShowtimeCrewRepository } from "../showtime/repository/showtime_crew.repository";
import { UserRepository } from "../user/repository/user.repository";
import { ShowtimeHolderRepository } from "../showtime/repository/showtime_holder.repository";
import { ShowtimeEntity } from "../showtime/entity/showtime.entity";
import { L2eEntity } from "../l2e/entity/l2e.entity";
import { NftMusicEntity } from "../nftmusic/entity/nftmusic.entity";
import { ShowtimeCrewEntity } from "../showtime/entity/showtime_crew.entity";
import { ShowtimeHolderEntity } from "../showtime/entity/showtime_holder.entity";
import { UserEntity } from "../user/entity/user.entity";
import { BannerEntity } from "../showtime/entity/banner.entity";
import { BannerRepository } from "../showtime/repository/banner.repository";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ShowtimeEntity,
      L2eEntity,
      NftMusicEntity,
      ShowtimeCrewEntity,
      ShowtimeHolderEntity,
      UserEntity,
      BannerEntity,
  ]),
  ], //L2eRepository 등록
  controllers: [MainController],
  providers: [
    MainService,
    ShowtimeRepository,
    L2eRepository,
    NftMusicRepository,
    ShowtimeCrewRepository,
    ShowtimeHolderRepository,
    UserRepository,
    BannerRepository,
  ],
  exports: [TypeOrmModule],
})
export class MainModule {}
