import {
  Body,
  Controller, Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, UseGuards
} from "@nestjs/common";
import { ShowtimeService } from "./showtime.service";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation, } from "@nestjs/swagger";
import { CreateShowTimeDataDto } from "./dto/create.showtimedata.dto";
import { PurchaseShowtimeDto } from "./dto/purchase.showtime.dto";
import { CreateShowTimeLikeDto } from "./dto/create.showtimelike.dto";
import { ResponseUpcomingDto } from "./dto/response.upcoming.dto";
import { ResponseRecentListDto, } from "./dto/response.recentlist.dto";
import { ResponseRecentDto } from "./dto/response.recent.dto";
import { CreateUserFollowerDto } from "./dto/create.userfollower.dto";
import { ResponseArtistDto } from "./dto/response.artist.dto";
import { ResponseTierListDto } from "./dto/response.tierlist.dto";
import { CoinMarketRateDto } from "./dto/create.coinmarketrate.dto";
import { EtherscanGastrackerDto } from "./dto/create.etherscangastracker.dto";
import { CreateBannerDataDto } from "./dto/create.bannerdata.dto";
import { ResponseBannerDataDto } from "./dto/response.bannerdata.dto";
import { CreateBannerLikeDto } from "./dto/create.bannerlike.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
@UseGuards(AuthGuard)
@Controller("/showtime")
export class ShowtimeController {

  constructor(private readonly showtimeService: ShowtimeService) {}
  /**
   * showtime IPFS 정보 생성
   * @param createShowTimeDto
   */
  // @ApiOperation({summary: 'showtime ipfs 정보 생성'})
  // @Post("/ipfs")
  // createShowtimeIpfs(@Body() createShowTimeDataDto: CreateShowTimeDataDto)
  //   : Promise<String> {
  //   return this.showtimeService.createShowtimeIpfs(3, createShowTimeDataDto);
  // }

  /**
   * last showTimeId
   */
  @ApiOperation({summary: 'last showTimeId'})
  @Post("/lastShowTimeId")
  getLastShowTimeId(): Promise<number> {
    return this.showtimeService.getLastShowTimeId();
  }

  /**
   * showtime 정보 생성
   * @param createShowTimeDto
   */
  @ApiOperation({summary: 'showtime data 정보 생성'})
  @Post("/data")
  createShowtimeData(@Body() createShowTimeDataDtos: CreateShowTimeDataDto)
    : Promise<string> {
    return this.showtimeService.createShowtimeData(createShowTimeDataDtos);
  }

  /**
   * showtime 구매
   * @param purchaseShowtimeDto
   */
  @ApiOperation({summary: 'showtime 구매'})
  @Post("/purchase")
  createShowtimePurchase(@Body() purchaseShowtimeDto: PurchaseShowtimeDto)
    : Promise<boolean> {
    return this.showtimeService.createShowtimePurchase(purchaseShowtimeDto);
  }

  /**
   * showtime 좋아요 갱신
   * @param createShowTimeLikeDto
   */
  @ApiOperation({summary: 'showtime 좋아요 갱신'})
  @Patch("/patchLike")
  patchLike(@Body() createShowTimeLikeDto: CreateShowTimeLikeDto)
    : Promise<boolean> {
    return this.showtimeService.patchLike(createShowTimeLikeDto);
  }

  @ApiOperation({summary: 'showtime Follower 갱신'})
  @Patch("/patchFollower")
  patchFollower(@Body() createUserFollowerDto: CreateUserFollowerDto)
    : Promise<boolean> {
    return this.showtimeService.patchFollower(createUserFollowerDto);
  }

  /**
   * showtime upcoming
   * @param userId
   */
  @ApiOperation({summary: 'showtime upcoming'})
  @Get("/upcoming/:showtimeId/:userId")
  getUpcoming(@Param("showtimeId", ParseIntPipe) showtimeId: number,
              @Param("userId", ParseIntPipe) userId: number,)
    : Promise<ResponseUpcomingDto> {
    return this.showtimeService.getUpcoming(showtimeId, userId);
  }

  /**
   * showtime RecentList
   */
  @ApiOperation({summary: 'showtime RecentList'})
  @Get("/recents/:userId")
  getRecents(@Param("userId", ParseIntPipe) userId: number,)
    : Promise<ResponseRecentListDto[]> {
    // return this.showtimeService.getRecents();
    return this.showtimeService.getAllShowtimes();
  }

  /**
   * showtime Recent
   * @param showtimeId
   * @param userId
   */
  @ApiOperation({summary: 'showtime Recent'})
  @Get("/recent/:showtimeId/:userId")
  getRecent(@Param("showtimeId", ParseIntPipe) showtimeId: number,
            @Param("userId", ParseIntPipe) userId: number,)
    : Promise<ResponseRecentDto> {
    return this.showtimeService.getRecent(showtimeId, userId);
  }

  /**
   * showtime Recent for iosWeb
   * @param showtimeId
   * @param userId
   */
  // @ApiOperation({summary: 'showtime Recent for iosWeb'})
  // @Get("/recent/ios/:showtimeId/:userId")
  // getRecentForIosWeb(@Param("showtimeId", ParseIntPipe) showtimeId: number,
  //           @Param("userId", ParseIntPipe) userId: number,)
  //   : Promise<ResponseRecentIosWebDto> {
  //   return this.showtimeService.getRecentForIosWeb(showtimeId, userId);
  // }

  /**
   * showtime tiers
   * @param tier
   * @param showtimeId
   */
  @ApiOperation({summary: 'showtime tiers'})
  @Get("/tiers/:tier/:showtimeId")
  getTiers(@Param("tier") tier: string,
            @Param("showtimeId", ParseIntPipe) showtimeId: number,)
    : Promise<ResponseTierListDto[]> {
    return this.showtimeService.getTiers(tier, showtimeId);
  }

  /**
   * showtime Artist
   * @param artistId
   * @param userId
   */
  @ApiOperation({summary: 'showtime Artist'})
  @Get("/artist/:artistId/:userId")
  async getArtist(@Param("artistId", ParseIntPipe) artistId: number,
                  @Param("userId", ParseIntPipe) userId: number,): Promise<ResponseArtistDto> {
    return this.showtimeService.getArtist(artistId, userId);
  }


  @Get("/servertime")
  async getServertime(): Promise<String> {
    return this.showtimeService.getServertime();
  }

  @Get("/getCoinCurrency")
  async getCoinCurrency(): Promise<CoinMarketRateDto[]> {
    return this.showtimeService.getCoinCurrency();
  }

  @Get("/getTargetCoinCurrency/:target")
  async getTargetCoinCurrency(@Param('target') target: string): Promise<string> {
    return this.showtimeService.getTargetCoinCurrency(target);
  }

  @Get("/getGasTracker")
  async getGasTracker(): Promise<EtherscanGastrackerDto> {
    return this.showtimeService.getGasTracker();
  }

  /**
   * Banner 정보 생성
   * @param createShowTimeDto
   */
  @ApiOperation({summary: 'Banner 정보 생성'})
  @Post("/banner")
  createBanner(@Body() createBannerDataDto: CreateBannerDataDto)
    : Promise<boolean> {
    return this.showtimeService.createBanner(createBannerDataDto);
  }

  /**
   * 언어별 배너목록
   * @param lang
   */
  @ApiOperation({summary: '언어별 배너목록 '})
  @Get("/banners/:lang")
  async getBanners(@Param("lang") lang: string): Promise<ResponseBannerDataDto[]> {
    return this.showtimeService.getBanners(lang);
  }

  /**
   * 배너 상세
   * @param lang
   */
  @ApiOperation({summary: '언어별 배너목록 '})
  @Get("/banner/:bannerId/:userId")
  async getBanner(@Param("bannerId", ParseIntPipe) bannerId: number,
                  @Param("userId", ParseIntPipe) userId: number,): Promise<ResponseBannerDataDto> {
    return this.showtimeService.getBanner(bannerId, userId);
  }

  /**
   * Banner 정보 수정
   * @param createShowTimeDto
   */
  @ApiOperation({summary: 'Banner 정보 수정'})
  @Patch("/banner/:bannerId")
  updateBanner(@Param("bannerId", ParseIntPipe) bannerId: number,
               @Body() createBannerDataDto: CreateBannerDataDto)
    : Promise<boolean> {
    return this.showtimeService.updateBanner(bannerId, createBannerDataDto);
  }

  /**
   * 배너 좋아요 갱신
   * @param createShowTimeLikeDto
   */
  @ApiOperation({summary: '배너 좋아요 갱신'})
  @Post("/banner/patchLike")
  bannerPatchLike(@Body() createBannerLikeDto: CreateBannerLikeDto)
    : Promise<boolean> {
    return this.showtimeService.bannerPatchLike(createBannerLikeDto);
  }

  /**
   * metadataForceUpdate
   * @param createShowTimeDto
   */
  @ApiOperation({summary: 'metadataForceUpdate'})
  @Post("/metadataForceUpdate")
  createShowtimeTempUpcoming()
    : Promise<boolean> {
    return this.showtimeService.metadataForceUpdate();
  }


}
