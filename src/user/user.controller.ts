import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe, UseGuards, Headers,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { InfoUserDto } from "./dto/info.user.dto";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import { ResponseInfoUserDto } from "./dto/response.info.user.dto";
import { ResponseOtpUserDto } from "./dto/response.otp.user.dto";
import { ResponseCorpWalletDto } from "./dto/response.corp.wallet.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 정보 생성
   * @param createUserDto
   */
  @ApiOperation({summary: '유저 정보 등록'})
  @Post()
  createUser(@Body() createUserDto: CreateUserDto)
    : Promise<number> {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 유저 정보 조회(param: 지갑주소)
   * @param address
   */
  @ApiOperation({summary: '유저 정보 조회 (param: 지갑주소)'})
  @Get("/address/:address")
  findByAddress(@Param("address") address: string) : Promise<InfoUserDto> {
    return this.userService.findByAddress(address);
  }

  /**
   * 유저 정보 조회(param: 핸들)
   * @param handle
   */
  @ApiOperation({summary: '유저 정보 조회 (param: 지갑주소)'})
  @Get("/handle/:handle")
  findByHandle(@Param("handle") handle: string) : Promise<InfoUserDto> {
    return this.userService.findByHandle(handle);
  }

  /**
   * 사용자 정보 수정
   * @param updateUserDto
   */
  @ApiHeader({
    name: 'auth_token',
    description: 'your auth_token'
  })
  @ApiOperation({summary: '유저 정보 수정'})
  @UseGuards(AuthGuard)
  @Patch("/:id")
  updateUser(@Param("id", ParseIntPipe) id: number,@Body() updateUserDto: UpdateUserDto)
    : Promise<boolean> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiHeader({
    name: 'auth_token',
    description: 'your auth_token'
  })
  @ApiOperation({summary: '유저 정보 조회'})
  @UseGuards(AuthGuard)
  @Get("/:id")
  findById(@Param("id", ParseIntPipe) id: number) : Promise<InfoUserDto> {
    return this.userService.findById(id)
  }

  @ApiHeader({
    name: 'auth_token',
    description: 'your auth_token'
  })
  @ApiOperation({summary: 'Handle 조회'})
  @UseGuards(AuthGuard)
  @Get("/isexisthandle/:handle")
  isExistHandle(@Param("handle") handle: string) : Promise<boolean> {
    return this.userService.isExistHandle(handle);
  }

  @UseGuards(AuthGuard)
  @Get("/get/info")
  getUserTokenInfo(@Headers("auth_token") authToken: string) : Promise<ResponseInfoUserDto> {
    return this.userService.getUserTokenInfo(authToken);
  }

  @UseGuards(AuthGuard)
  @Post("/checkOtp")
  checkOtp(@Headers("auth_token") authToken: string) : Promise<ResponseOtpUserDto> {
    return this.userService.checkOtp(authToken);
  }

  @UseGuards(AuthGuard)
  @Post("/verifyOtp")
  verifyOtp(@Headers("auth_token") authToken: string,
    @Body('code') code: string) : Promise<boolean> {
    return this.userService.verifyOtp(authToken, code);
  }

  @UseGuards(AuthGuard)
  @Post("/corpWallet")
  getCorpWalletInfo(@Headers("auth_token") authToken: string) : Promise<ResponseCorpWalletDto> {
    return this.userService.getCorpWalletInfo();
  }
}
