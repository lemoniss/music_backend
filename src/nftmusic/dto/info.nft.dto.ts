import { InfoFileDto } from "../../mymusic/dto/info.file.dto";
import { ResponseSongInfoDto } from "../../showtime/dto/response.songinfo.dto";
import { ResponseNftInfoDto } from "../../showtime/dto/response.nftinfo.dto";
import { ResponseUserInfoDto } from "../../showtime/dto/response.userinfo.dto";
import { ResponseContractInfoDto } from "../../showtime/dto/response.contractinfo.dto";

export class InfoNftDto {

  nftMusicId: number;  // 음악생성 식별자  ( source == showtime 이면 tierId가 된다.)

  title: string; // 앨범타이틀

  name: string; // 노래제목

  artist: string; // 아티스트

  genres: string;  // 장르 파싱한 데이터

  description: string; // 설명

  musicFileUrl: string; // 음악파일URL

  imgFileUrl: string; // 이미지파일URL

  rareImgFileUrl: string[]; // 레어 이미지파일URL

  playTime: number; // 재생시간

  playCount: number;

  genreIds: number[];

  files: InfoFileDto[];

  musicFileName: string; // 음악파일명

  isLike: boolean;  // 좋아요 여부

  likeCount: number;

  ipfsHash: string;

  minter: string;

  tokenId: string;

  isOnSale: string;

  price: string;

  source: string;

  handle: string;

  userId: number;

  tier: string;

  rareYn: string;

  itemId: string;

  exchangeId: string;

  lyrics: string;

  totalLikeCount: number;

  showtimeId: number;

  songInfo: ResponseSongInfoDto;

  nftInfo: ResponseNftInfoDto;

  artists: ResponseUserInfoDto[];

  producers: ResponseUserInfoDto[];

  fellaz: ResponseUserInfoDto[];

  contractInfo: ResponseContractInfoDto;

  artistId: number;

  artistImage: string;

  artistBannerImage: string;

  floorPrice: number;
}
