import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserController } from './user/user.controller';
import { GenreModule } from "./genre/genre.module";
import { ConfigModule} from "@nestjs/config";
import { UploadModule } from "./upload/upload.module";
import { UploadController } from "./upload/upload.controller";
import { GenreController } from "./genre/genre.controller";
import { MyMusicModule } from "./mymusic/mymusic.module";
import { MyMusicController } from "./mymusic/mymusic.controller";
import { NftMusicController } from "./nftmusic/nftmusic.controller";
import { NftMusicModule } from "./nftmusic/nftmusic.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExchangeController } from "./exchange/exchange.controller";
import { ShowtimeModule } from "./showtime/showtime.module";
import { ShowtimeController } from "./showtime/showtime.controller";
import { EventModule } from "./event/event.module";
import { EventController } from "./event/event.controller";
import { LandingModule } from "./landing/landing.module";
import { LandingController } from "./landing/landing.controller";
import { MainModule } from "./main/main.module";
import { UtilModule } from "./util/util.module";
import { Web3Module } from "nest-web3";
import { BlockchainModule } from "./blockchain/blockchain.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' :
        process.env.NODE_ENV == 'prod' ? '.env.prod' : '.env.local',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', //Database 설정
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname+'/**/*.entity.{ts,js}'], // Entity 연결
      synchronize: false,  // 운영에서는 무조건 false 로 설정할 것
      logging: true,  // 운영에서는 무조건 false 로 설정할 것
      // autoLoadEntities: true
    }),
    Web3Module.forRoot({
      name: 'eth',
      url: process.env.ETHCLIENT_ENDPOINT,
    }),
    UserModule,
    GenreModule,
    UploadModule,
    MyMusicModule,
    NftMusicModule,
    ExchangeModule,
    ShowtimeModule,
    EventModule,
    LandingModule,
    MainModule,
    UtilModule,
    BlockchainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      //exclude 함수는 제외 하고싶은 라우터를 등록합니다.
      .exclude({ path: 'users/address/(.*)', method: RequestMethod.GET }, { path: 'users/handle/(.*)', method: RequestMethod.GET }, { path: 'users', method: RequestMethod.POST }
        , { path: 'events/(.*)', method: RequestMethod.GET }, { path: 'events', method: RequestMethod.POST } // event 생성
        , { path: 'landing/(.*)', method: RequestMethod.GET } // landing
        , { path: '/nfts/playlist', method: RequestMethod.POST } // playlist
        , { path: 'exchange', method: RequestMethod.POST }, { path: 'exchange/details/(.*)', method: RequestMethod.GET })
      // .exclude({ path: 'user/user_all', method: RequestMethod.GET }) // 유저 전체 조회
      .forRoutes(
        UserController,
        UploadController,
        GenreController,
        MyMusicController,
        NftMusicController,
        ExchangeController,
        ShowtimeController,
        // ItemController,
        // MainController,
      );
  }
}
