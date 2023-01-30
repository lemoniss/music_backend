import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, Query, UseGuards
} from "@nestjs/common";
import { CreateMusicDto } from "./dto/create.music.dto";
import { MyMusicService } from "./mymusic.service";
import { UpdateMusicDto } from "./dto/update.music.dto";
import { InfoMusicDto } from "./dto/info.music.dto";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { UpdateMusicStatusDto } from "./dto/status.music.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
@UseGuards(AuthGuard)
@Controller("/musics")
export class MyMusicController {

  constructor(private readonly myMusicService: MyMusicService) {}
  /**
   * 내 음악 정보 생성
   * @param createMusicDto
   */
  @ApiOperation({summary: '내 음악 정보 생성'})
  @Post("/:userId")
  createMusic(@Param("userId", ParseIntPipe) userId: number,
              @Body() createMusicDto: CreateMusicDto)
    : Promise<boolean> {
    return this.myMusicService.createMusic(userId, createMusicDto);
  }

  /**
   * 음악 정보 수정
   * @param updateUserDto
   */
  @Patch("/:myMusicId")
  @ApiOperation({summary: '내 음악 정보 수정'})
  updateMusic(@Param("myMusicId", ParseIntPipe) myMusicId: number,
              @Body() updateMusicDto: UpdateMusicDto)
    : Promise<boolean> {
    return this.myMusicService.updateMusic(myMusicId, updateMusicDto);
  }

  /**
   * 음악 리스트 (검색: nullable)
   * @param userId
   * @param search
   */
  @Get("/:userId")
  @ApiOperation({summary: '내 음악 리스트'})
  @ApiQuery({name: 'keyword', required: false})
  findMusicList(@Param("userId", ParseIntPipe) userId: number,
                @Query('keyword') keyword: string)
    : Promise<InfoMusicDto[]> {
    return this.myMusicService.findMusicList(userId, keyword);
  }

  /**
   * 음악 상세
   * @param myMusicId
   */
  @Get("/details/:myMusicId")
  @ApiOperation({summary: '내 음악 상세'})
  findMusicInfo(@Param("myMusicId", ParseIntPipe) myMusicId: number)
    : Promise<InfoMusicDto> {
    return this.myMusicService.findMusicInfo(myMusicId);
  }

  /**
   * 음악 삭제
   * @param myMusicId
   */
  @Delete("/:myMusicId")
  @ApiOperation({summary: '내 음악 삭제'})
  deleteMusic(@Param("myMusicId", ParseIntPipe) myMusicId: number)
    : Promise<boolean> {
    return this.myMusicService.deleteMusic(myMusicId);
  }

  /**
   * 음악 상태 정보 수정
   * @param updateUserDto
   */
  @Patch("/status/:myMusicId")
  @ApiOperation({summary: '음악 상태 정보 수정'})
  updateMusicStatus(@Param("myMusicId", ParseIntPipe) myMusicId: number,
              @Body() updateMusicStatusDto: UpdateMusicStatusDto)
    : Promise<boolean> {
    return this.myMusicService.updateMusicStatus(myMusicId, updateMusicStatusDto);
  }
}
