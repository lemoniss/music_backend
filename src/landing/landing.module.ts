import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
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
  ]),
  ], //L2eRepository 등록
  controllers: [LandingController],
  providers: [
    LandingService,
    ShowtimeRepository,
    L2eRepository,
    NftMusicRepository,
    ShowtimeCrewRepository,
    ShowtimeHolderRepository,
    UserRepository
  ],
  exports: [TypeOrmModule],
})
export class LandingModule {}
