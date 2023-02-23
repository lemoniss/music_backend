import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShowtimeService } from "./showtime.service";
import { ShowtimeController } from "./showtime.controller";
import { ShowtimeRepository } from "./repository/showtime.repository";
import { ShowtimeGenreRepository } from "./repository/showtime_genre.repository";
import { ShowtimeFileRepository } from "./repository/showtime_file.repository";
import { UserModule } from "../user/user.module";
import { UploadModule } from "../upload/upload.module";
import { GenreModule } from "../genre/genre.module";
import { ShowtimeDistributorRepository } from "./repository/showtime_distributor.repository";
import { UserShowtimeRepository } from "./repository/user_showtime.repository";
import { ShowtimeTierRepository } from "./repository/showtime_tier.repository";
import { ShowtimePurchasehistoryRepository } from "./repository/showtime_purchasehistory.repository";
import { ShowtimeCrewRepository } from "./repository/showtime_crew.repository";
import { ShowtimeLikeRepository } from "./repository/showtime_like.repository";
import { UserFollowerRepository } from "./repository/user_follower.repository";
import { UserRepository } from "./repository/user.repository";
import { UpcomingToRecentRepository } from "./repository/upcoming_to_recent.repository";
import { UpcomingToRecentFileRepository } from "./repository/upcoming_to_recent_file.repository";
import { UpcomingToRecentGenreRepository } from "./repository/upcoming_to_recent_genre.repository";
import { ScheduleModule } from "@nestjs/schedule";
import { ShowtimeHolderRepository } from "./repository/showtime_holder.repository";
import { NftHistoryRepository } from "../nftmusic/repository/nfthistory.repository";
import { CoinMarketRateRepository } from "./repository/coin_marketrate.repository";
import { EtherscanGastrackerRepository } from "./repository/etherscan_gastracker.repository";
import { BannerRepository } from "./repository/banner.repository";
import { BannerFileRepository } from "./repository/banner_file.repository";
import { BannerLikeRepository } from "./repository/banner_like.repository";
import { ShowtimeEntity } from "./entity/showtime.entity";
import { ShowtimeGenreEntity } from "./entity/showtime_genre.entity";
import { ShowtimeDistributorEntity } from "./entity/showtime_distributor.entity";
import { UserShowtimeEntity } from "./entity/user_showtime.entity";
import { ShowtimeTierEntity } from "./entity/showtime_tier.entity";
import { ShowtimeFileEntity } from "./entity/showtime_file.entity";
import { ShowtimePurchaseHistoryEntity } from "./entity/showtime_purchasehistory.entity";
import { ShowtimeCrewEntity } from "./entity/showtime_crew.entity";
import { ShowtimeLikeEntity } from "./entity/showtime_like.entity";
import { UserFollowerEntity } from "./entity/user_follower.entity";
import { UserEntity } from "./entity/user.entity";
import { ShowtimeHolderEntity } from "./entity/showtime_holder.entity";
import { NftMusicEntity } from "./entity/nftmusic.entity";
import { NftMusicFileEntity } from "./entity/nftmusic_file.entity";
import { NftMusicGenreEntity } from "./entity/nftmusic_genre.entity";
import { NftHistoryEntity } from "../nftmusic/entity/nfthistory.entity";
import { CoinMarketRateEntity } from "./entity/coin_marketrate.entity";
import { EtherscanGastrackerEntity } from "./entity/etherscan_gastracker.entity";
import { BannerEntity } from "./entity/banner.entity";
import { BannerFileEntity } from "./entity/banner_file.entity";
import { BannerLikeEntity } from "./entity/banner_like.entity";

@Module({
  imports: [
    UserModule,
    UploadModule,
    GenreModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      ShowtimeEntity,
      ShowtimeGenreEntity,
      ShowtimeDistributorEntity,
      UserShowtimeEntity,
      ShowtimeTierEntity,
      ShowtimeFileEntity,
      ShowtimePurchaseHistoryEntity,
      ShowtimeCrewEntity,
      ShowtimeLikeEntity,
      UserFollowerEntity,
      UserEntity,
      ShowtimeHolderEntity,
      NftMusicEntity,
      NftMusicFileEntity,
      NftMusicGenreEntity,
      NftHistoryEntity,
      CoinMarketRateEntity,
      EtherscanGastrackerEntity,
      BannerEntity,
      BannerFileEntity,
      BannerLikeEntity,
    ])
  ],
  controllers: [ShowtimeController],
  providers: [
    ShowtimeService,
    ShowtimeRepository,
    ShowtimeGenreRepository,
    ShowtimeDistributorRepository,
    UserShowtimeRepository,
    ShowtimeTierRepository,
    ShowtimeFileRepository,
    ShowtimePurchasehistoryRepository,
    ShowtimeCrewRepository,
    ShowtimeLikeRepository,
    UserFollowerRepository,
    UserRepository,
    ShowtimeHolderRepository,
    UpcomingToRecentRepository,
    UpcomingToRecentFileRepository,
    UpcomingToRecentGenreRepository,
    NftHistoryRepository,
    CoinMarketRateRepository,
    EtherscanGastrackerRepository,
    BannerRepository,
    BannerFileRepository,
    BannerLikeRepository,
    UploadModule,
  ],
  exports: [TypeOrmModule, ShowtimeService],
})
export class ShowtimeModule {}
