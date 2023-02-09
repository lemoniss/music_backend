import {
  Body,
  Controller,
  Get, Headers,
  Param, ParseIntPipe,
  Post, Query, UseGuards
} from "@nestjs/common";
import { MainService } from "./main.service";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "../guard/auth.guard";
import { ResponseInfoUserDto } from "../user/dto/response.info.user.dto";

@Controller("main")
export class MainController {
  constructor(private readonly mainService: MainService) {}

  /**
   * get LaunchApp Main Data
   * @param address
   */
  @ApiOperation({summary: 'Main data'})
  @Get()
  getMainDatas(@Headers("auth_token") authToken: string) : Promise<any> {
    return this.mainService.getMainDatas(authToken);
  }

  // @UseGuards(AuthGuard)
  // @Get("/get/info")
  // getUserTokenInfo(@Headers("auth_token") authToken: string) : Promise<ResponseInfoUserDto> {
  //   return this.userService.getUserTokenInfo(authToken);
  // }

  @ApiOperation({summary: 'landing main artist data'})
  @Get('/artists')
  getLandingArtistsDatas(@Query('skip') skip: number) : Promise<any> {

    return this.mainService.getLandingArtistsDatas(isNaN(skip) ? 0 : skip);
  }

  @ApiOperation({summary: 'landing view song data'})
  @Get('/viewsong/:source/:musicId')
  getMainViewsong(@Headers("auth_token") authToken: string,
                     @Param("source") source: string,
                     @Param("musicId", ParseIntPipe) musicId: number,) : Promise<any> {
    return this.mainService.getMainViewsong(authToken, source, musicId);
  }

  @ApiOperation({summary: 'landing artist page data'})
  @Get('/artist/:handle')
  getMainArtistInfo(@Headers("auth_token") authToken: string,
                    @Param("handle") handle: string,) : Promise<any> {
    return this.mainService.getMainArtistInfo(authToken, handle);
  }

  @ApiOperation({summary: 'landing getLandingFellazByArtist data'})
  @Get('/artist/fellaz/:handle/')
  getLandingFellazByArtist(@Param("handle") handle: string,
                           @Query('skip') skip: number) : Promise<any> {
    return this.mainService.getLandingFellazByArtist(handle, skip);
  }

}


