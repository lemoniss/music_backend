// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { DashboardMusicService } from "./dashboardmusic.service";
// import { DashboardMusicController } from "./dashboardmusic.controller";
// import { DashboardMusicRepository } from "./repository/dashboardmusic.repository";
// import { MyMusicModule } from "../mymusic/mymusic.module";
// import { UploadModule } from "../upload/upload.module";
// import { L2eModule } from "../user/user.module";
//
// @Module({
//   imports: [
//     L2eModule,
//     MyMusicModule,
//     UploadModule,
//     TypeOrmModule.forFeature([
//       DashboardMusicRepository,
//     ]),
//   ],
//   controllers: [DashboardMusicController],
//   providers: [DashboardMusicService],
//   exports: [DashboardMusicService]
// })
// export class DashboardMusicModule {}
