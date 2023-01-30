import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExchangeGenreRepository } from "./repository/exchange_genre.repository";
import { ExchangeFileRepository } from "./repository/exchange_file.repository";
import { ExchangeService } from "./exchange.service";
import { ExchangeController } from "./exchange.controller";
import { ExchangeRepository } from "./repository/exchange.repository";
import { UserExchangeRepository } from "./repository/user_exchange.repository";
import { UserModule } from "../user/user.module";
import { NftMusicModule } from "../nftmusic/nftmusic.module";
import { ShowtimeModule } from "../showtime/showtime.module";
import { ExchangeEntity } from "./entity/exchange.entity";
import { ExchangeGenreEntity } from "./entity/exchange_genre.entity";
import { ExchangeFileEntity } from "./entity/exchange_file.entity";
import { UserExchangeEntity } from "./entity/user_exchange.entity";
import { NftMusicService } from "../nftmusic/nftmusic.service";
import { ShowtimeService } from "../showtime/showtime.service";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";

@Module({
  imports: [
    UserModule,
    NftMusicModule,
    ShowtimeModule,
    TypeOrmModule.forFeature([
      ExchangeEntity,
      ExchangeGenreEntity,
      ExchangeFileEntity,
      UserExchangeEntity,
    ]),
  ],
  controllers: [ExchangeController],
  providers: [
    ExchangeService,
    ExchangeRepository,
    ExchangeGenreRepository,
    ExchangeFileRepository,
    UserExchangeRepository,
    NftMusicModule,
    ShowtimeModule,
  ],
  exports: [TypeOrmModule, ExchangeService]
})
export class ExchangeModule {}
