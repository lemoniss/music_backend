import { ResponseSongInfoDto } from "../../showtime/dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../../showtime/dto/response.nftinfo.dto";
import { ResponseContractInfoDto } from "../../showtime/dto/response.contractinfo.dto";
import { ResponseUserInfoDto } from "../../showtime/dto/response.userinfo.dto";

export class InfoExchangeDto {

  exchangeId: number;  // 음악생성 식별자

  itemId: number;

  tokenId: string;

  title: string; // 앨범타이틀

  name: string; // 노래제목

  artist: string; // 아티스트

  genres: string;  // 장르 파싱한 데이터

  description: string; // 설명

  musicFileUrl: string; // 음악파일URL

  imgFileUrl: string; // 이미지파일URL

  rareImgFileUrl: string[]; // 레어 이미지파일URL

  playTime: number; // 재생시간

  price: string; // 판매가격

  seller: string; // 판매자

  playCount: number;  // 플레이횟수

  likeCount: number;  // 좋아요횟수

  nftMusicId: number;

  source: string;

  userId: number;

  handle: string;

  tier: string;

  rareYn: string;

  lyrics: string;

  isLike: boolean;

  showTimeId: number;

  songInfo: ResponseSongInfoDto;

  nftInfo: ResponseNftInfoDto;

  contractInfo: ResponseContractInfoDto;

  artists: ResponseUserInfoDto[];

  producers: ResponseUserInfoDto[];

  fellaz: ResponseUserInfoDto[];
}
