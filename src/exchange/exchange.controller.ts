import {
  Body,
  Controller,
  Get, Headers,
  Param,
  ParseIntPipe,
  Post, UseGuards
} from "@nestjs/common";
import { ExchangeService } from "./exchange.service";
import { InfoExchangeDto } from "./dto/info.exchange.dto";
import { CreateExchangeDto } from "./dto/create.exchange.dto";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation, } from "@nestjs/swagger";
import { SearchExchangeDto } from "./dto/search.exchange.dto";
import { ItemExchangeDto } from "./dto/item.exchange.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})

@Controller("/exchange")
export class ExchangeController {

  constructor(private readonly exchangeService: ExchangeService) {}

  /**
   * 거래소 등록
   * @param createMusicDto
   */
  @ApiOperation({summary: '거래소 등록'})
  @UseGuards(AuthGuard)
  @Post('/register/:userId')
  registerExchangeItem(@Param("userId", ParseIntPipe) userId: number,
    @Body() createExchangeDto: CreateExchangeDto)
    : Promise<boolean> {
    return this.exchangeService.registerExchangeItem(userId, createExchangeDto);
  }

  /**
   * 거래소 리스트 (검색: nullable)
   * @param userId
   * @param search
   */
  @Post()
  @ApiOperation({summary: '거래소 리스트'})
  findExchangeList(@Headers("auth_token") authToken: string,
                   @Body() searchExchangeDto: SearchExchangeDto)
    : Promise<any> {
    if(typeof authToken != 'undefined') searchExchangeDto.authToken = authToken;
    return this.exchangeService.findExchangeList(searchExchangeDto);
  }


  /**
   * 거래소 상세
   * @param nftMusicId
   */
  @Get("/details/:exchangeId")
  @ApiOperation({summary: '거래소 상세'})
  findExchangeInfo(@Headers("auth_token") authToken: string,
                   @Param("exchangeId") exchangeId: number)
    : Promise<any> {
    return this.exchangeService.findExchangeInfo(exchangeId, authToken);
  }

  /**
   * 내지갑에서 nft구매취소시 호출 (나중에 앱에서 endPoint를 수정한다.
   * @param nftMusicId
   */
  // @Get('/details/token/:tokenId')
  // @ApiOperation({summary: '거래소 상세'})
  // findExchangeInfoByTokenId(@Param("tokenId") tokenId: number)
  //   : Promise<InfoExchangeDto> {
  //   return this.exchangeService.findExchangeInfoByTokenId(tokenId);
  // }

  /**
   * 구매
   * @param userId
   * @param purchaseExchangeDto
   */
  @ApiOperation({summary: '거래소 구매'})
  @UseGuards(AuthGuard)
  @Post('/purchase')
  purchase(@Headers("auth_token") authToken: string,
           @Body() itemExchangeDto: ItemExchangeDto)
    : Promise<boolean> {
    return this.exchangeService.purchase(authToken, itemExchangeDto);
  }

  /**
   * 삭제
   * @param userId
   * @param purchaseExchangeDto
   */
  @ApiOperation({summary: '거래소 상품 삭제'})
  @Post('/remove/:exchangeId')
  @UseGuards(AuthGuard)
  remove(@Param("exchangeId", ParseIntPipe) exchangeId: number)
    : Promise<boolean> {
    return this.exchangeService.remove(exchangeId);
  }

  /**
   * 취소
   * @param userId
   * @param purchaseExchangeDto
   */
  @ApiOperation({summary: '거래소 등록취소'})
  @Post('/cancel/:userId')
  @UseGuards(AuthGuard)
  cancel(@Param("userId", ParseIntPipe) userId: number,
         @Body() itemExchangeDto: ItemExchangeDto)
    : Promise<boolean> {
    return this.exchangeService.cancel(userId, itemExchangeDto);
  }
}
