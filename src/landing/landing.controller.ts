import {
  Body,
  Controller,
  Get,
  Param, ParseIntPipe,
  Post, Query
} from "@nestjs/common";
import { LandingService } from "./landing.service";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";

@Controller("landing")
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  /**
   * 유저 Event 조회
   * @param address
   */
  @ApiOperation({summary: 'landing main data'})
  @Get()
  getLandingDatas() : Promise<any> {
    return this.landingService.getLandingDatas();
  }

  @ApiOperation({summary: 'landing main artist data'})
  @Get('/artists')
  getLandingArtistsDatas(@Query('skip') skip: number) : Promise<any> {

    return this.landingService.getLandingArtistsDatas(isNaN(skip) ? 0 : skip);
  }

  @ApiOperation({summary: 'landing view song data'})
  @Get('/viewsong/:source/:musicId')
  getLandingViewsong(@Param("source") source: string,
                     @Param("musicId", ParseIntPipe) musicId: number,) : Promise<any> {
    return this.landingService.getLandingViewsong(source, musicId);
  }

  @ApiOperation({summary: 'landing artist page data'})
  @Get('/artist/:handle')
  getLandingArtistInfo(@Param("handle") handle: string,) : Promise<any> {
    return this.landingService.getLandingArtistInfo(handle);
  }

  @ApiOperation({summary: 'landing getLandingFellazByArtist data'})
  @Get('/artist/fellaz/:handle/')
  getLandingFellazByArtist(@Param("handle") handle: string,
                           @Query('skip') skip: number) : Promise<any> {
    return this.landingService.getLandingFellazByArtist(handle, skip);
  }

}


