import {
  Body,
  Controller, Delete,
  Get, Headers,
  Param,
  ParseIntPipe, Patch,
  Post, UseGuards
} from "@nestjs/common";
import { NftMusicService } from "./nftmusic.service";
import { InfoNftDto } from "./dto/info.nft.dto";
import { CreateNftDto } from "./dto/create.nft.dto";
import { NftLikeDto } from "./dto/like.nft.dto";
import { SortNftDto } from "./dto/sort.nft.dto";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { GiftNftDto } from "./dto/gift.nft.dto";
import { InfoNftHistoryDto } from "./dto/info.nfthistory.dto";
import { NftHistoryDto } from "./dto/nfthistory.dto";
import {FindByUserNftDto} from "./dto/findbyuser.nft.dto";
import { NftProvenanceDto } from "./dto/nft.provenance.dto";
import { CreateL2eDto } from "./dto/create.l2e.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
@UseGuards(AuthGuard)
@Controller("nfts")
export class NftMusicController {

  constructor(private readonly nftMusicService: NftMusicService) {}
  /**
   * 음악 IPFS 정보 생성
   * @param createMusicDto
   */
  @ApiOperation({summary: 'NFT 음악 정보 생성'})
  @Post('/ipfs')
  createIpfs(@Headers("auth_token") authToken: string,
              @Body() createNftDto: CreateNftDto)
    : Promise<string> {
    return this.nftMusicService.createIpfs(authToken, createNftDto);
  }

  /**
   * 음악 정보 생성
   * @param createMusicDto
   */
  @ApiOperation({summary: 'NFT 음악 정보 생성'})
  @Post('/mint')
  createNft(@Headers("auth_token") authToken: string,
             @Body() createNftDto: CreateNftDto)
    : Promise<boolean> {
    return this.nftMusicService.createNft(authToken, createNftDto);
  }

  /**
   * 내 NFT 리스트
   * @param createMusicDto
   */
  @ApiOperation({summary: '내 NFT 리스트'})
  @Get('/myNft')
  findMyNftList(@Headers("auth_token") authToken: string)
    : Promise<InfoNftDto[]> {
    return this.nftMusicService.findMyNftList(authToken);
  }

  /**
   * 음악 리스트 (검색: nullable)
   * @param userId
   * @param search
   */
  @Post()
  @ApiOperation({summary: 'NFT 음악 리스트'})
  findNftList(@Body() sortNftDto: SortNftDto)
    : Promise<InfoNftDto[]> {
    return this.nftMusicService.findNftList(sortNftDto);
  }

  /**
   * 음악 리스트 (검색: nullable)
   * @param userId
   * @param targetUserId
   * @param search
   */
  @Post('/findbyuserid')
  @ApiOperation({summary: '유저별 NFT 음악 리스트'})
  findNftListByUser(@Body() findByUserNftDto: FindByUserNftDto)
      : Promise<InfoNftDto[]> {
    return this.nftMusicService.findNftListByUser(findByUserNftDto);
  }

  /**
   * 음악 리스트 (검색: nullable)
   * @param userId
   * @param search
   */
  @Post('/like/:userId')
  @ApiOperation({summary: 'NFT 좋아요 음악 리스트'})
  findNftLikeList(@Body() sortNftDto: SortNftDto)
    : Promise<InfoNftDto[]> {
    return this.nftMusicService.findNftLikeList(sortNftDto);
  }

  /**
   * 즐겨찾기 추가
   * @param nftLikeDto
   */
  @Post('/like')
  @ApiOperation({summary: 'NFT 음악 즐겨찾기 추가'})
  createNftLike(@Body() nftLikeDto: NftLikeDto)
    : Promise<boolean> {
    return this.nftMusicService.createNftLike(nftLikeDto);
  }

  /**
   * 좋아요 삭제
   * @param nftLikeDto
   */
  @Delete('/like')
  @ApiOperation({summary: 'NFT 음악 좋아요 삭제'})
  deleteNftLike(@Body() nftLikeDto: NftLikeDto)
    : Promise<boolean> {
    return this.nftMusicService.deleteNftLike(nftLikeDto);
  }

  /**
   * 음악 상세
   * @param nftMusicId
   */
  @Get("/details/:source/:nftMusicId")
  @ApiOperation({summary: 'NFT 음악 상세'})
  findNftInfo(@Headers("auth_token") authToken: string,
              @Param("source") source: string,
              @Param("nftMusicId", ParseIntPipe) nftMusicId: number)
    : Promise<InfoNftDto> {
    return this.nftMusicService.findNftInfo(source, nftMusicId, authToken);
  }

  /**
   * 음악 재생횟수 추가
   * @param nftMusicId
   */
  @Patch('/count/:nftMusicId')
  @ApiOperation({summary: 'NFT 음악 재생횟수 추가'})
  patchPlayCount(@Param("nftMusicId", ParseIntPipe) nftMusicId: number) {
    this.nftMusicService.patchPlayCount(nftMusicId).then();
  }

  /**
   * 판매중 상태로 업데이트
   * @param nftMusicId
   */
  @Patch('/onsale/:nftMusicId/:source/:onSaleType')
  @ApiOperation({summary: 'NFT 판매중 상태로 업데이트'})
  @UseGuards(AuthGuard)
  patchOnSale(@Param("nftMusicId", ParseIntPipe) nftMusicId: number,
              @Param("source") source: string,
              @Param("onSaleType") onSaleType: string) {
    this.nftMusicService.patchOnSale(nftMusicId, source, onSaleType).then();
  }

  /**
   * 선물하기
   * @param nftLikeDto
   */
  @Post('/nftGift/:userId')
  @ApiOperation({summary: 'NFT 음악 선물하기'})
  nftGift(@Param("userId", ParseIntPipe) userId: number,
          @Body() giftNftDto: GiftNftDto)
    : Promise<boolean> {
    return this.nftMusicService.nftGift(userId, giftNftDto);
  }

  @Post('/history/save')
  @ApiOperation({summary: 'NFT 음악 재생횟수 추가'})
  saveHistory(@Body() nftHistoryDto: NftHistoryDto) {
    this.nftMusicService.saveHistory(nftHistoryDto).then();
  }

  /**
   * tokenId로 이력 가져오기
   * @param nftMusicId
   */
  @ApiOperation({summary: 'getNftHistoryInTokenId'})
  @Get('/history/music/:tokenId')
  getNftHistoryInTokenId(@Param("tokenId") tokenId: string)
    : Promise<NftProvenanceDto[]> {
    return this.nftMusicService.getNftHistoryInTokenId(tokenId);
  }

  /**
   * address로 이력 가져오기
   * @param userId
   */
  @ApiOperation({summary: 'getNftHistoryInAddress'})
  @Get('/history/user/:address')
  getNftHistoryInAddress(@Param("address") address: string)
    : Promise<InfoNftHistoryDto[]> {
    return this.nftMusicService.getNftHistoryInAddress(address);
  }

  /**
   * 이력 상세 가져오기
   * @param userId
   */
  @ApiOperation({summary: 'getNftHistoryDetail'})
  @Get('/history/detail/:id')
  getNftHistoryDetail(@Param("id", ParseIntPipe) id: number,)
    : Promise<InfoNftHistoryDto> {
    return this.nftMusicService.getNftHistoryDetail(id);
  }

  /**
   * L2E 기록
   * @param createL2eDto
   */
  @Post('/l2e')
  @ApiOperation({summary: 'L2E 기록'})
  createL2e(@Body() createL2eDto: CreateL2eDto) {
    this.nftMusicService.createL2e(createL2eDto).then();;
  }

  /**
   * 음악 리스트 (검색: nullable)
   * @param userId
   * @param search
   */
  @Post('/playlist')
  @ApiOperation({summary: 'NFT 음악 리스트'})
  playList(@Headers("auth_token") authToken: string,
           @Body() sortNftDto: SortNftDto)
    : Promise<any> {
    return this.nftMusicService.playList(authToken, sortNftDto);
  }
}
