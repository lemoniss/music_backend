// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from '@nestjs/typeorm';
// import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
// import { DashboardMusicRepository } from "./repository/dashboardmusic.repository";
// import { CreateNftDto } from "./dto/create.nft.dto";
// import { NftLikeDto } from "./dto/like.nft.dto";
// import { InfoNftDto } from "./dto/info.nft.dto";
// import { MyMusicService } from "../mymusic/mymusic.service";
// import { UploadService } from "../upload/upload.service";
// import { MetadataNftDto } from "./dto/metadata.nft.dto";
// import {SortDashboardDto} from "./dto/sort.dashboard.dto";
//
// @Injectable()
// export class DashboardMusicService {
//   constructor(
//     @InjectRepository(DashboardMusicRepository) private dashboardMusicRepository: DashboardMusicRepository,
//     // private myMusicService: ShowtimeService,
//     // private uploadService: UploadService,
//   ) {}
//
//   async findNftList(sortDashboardDto: SortDashboardDto): Promise<InfoNftDto[]> {
//     return await this.dashboardMusicRepository.findNftList(sortDashboardDto);
//   }
//   //
//   // async findNftLikeList(userId: number, search: string): Promise<InfoExchangeDto[]> {
//   //   return await this.dashboardMusicRepository.findNftLikeList(userId, search);
//   // }
//
// }
