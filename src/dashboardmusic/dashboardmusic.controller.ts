// import {
//   Body,
//   Controller, Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post, Query, UseGuards
// } from "@nestjs/common";
// import { DashboardMusicService } from "./dashboardmusic.service";
// import { InfoNftDto } from "./dto/info.nft.dto";
// import { AuthGuard } from "../guard/auth.guard";
// import { ApiHeader, ApiOperation, ApiQuery } from "@nestjs/swagger";
// import { SortDashboardDto } from "./dto/sort.dashboard.dto";
//
// @ApiHeader({
//   name: 'auth_token',
//   description: 'your auth_token'
// })
// @UseGuards(AuthGuard)
// @Controller("/dashboards")
// export class DashboardMusicController {
//
//   constructor(private readonly dashboardMusicService: DashboardMusicService) {}
//   /**
//    * 대시보드 음악 리스트 (검색: nullable)
//    * @param userId
//    * @param search
//    */
//   // @Get()
//   // @ApiOperation({summary: '대시보드 음악 리스트'})
//   // @ApiQuery({name: 'search', required: false})
//   // findMusicList(@Query('search') search: string)
//   //   : Promise<InfoExchangeDto[]> {
//   //   return this.dashboardMusicService.findNftList(search);
//   // }
//
//   @Post()
//   @ApiOperation({summary: '대시보드 음악 리스트'})
//   // @ApiQuery({name: 'search', required: false})
//   postExample(@Body() sortDashboardDto: SortDashboardDto )
//       : Promise<InfoNftDto[]> {
//     return this.dashboardMusicService.findNftList(sortDashboardDto);
//   }
//
//
//   // /**
//   //  * 대시보드 좋아요 음악 리스트 (검색: nullable)
//   //  * @param userId
//   //  * @param search
//   //  */
//   // @Get('/like/:userId')
//   // @ApiOperation({summary: '대시보드 좋아요 음악 리스트'})
//   // @ApiQuery({name: 'search', required: false})
//   // findMusicLikeList(@Param("userId", ParseIntPipe) userId: number,
//   //                   @Query('search') search: string)
//   //   : Promise<InfoExchangeDto[]> {
//   //   return this.dashboardMusicService.findNftLikeList(userId, search);
//   // }
//   //
//
// }
