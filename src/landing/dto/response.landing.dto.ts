import { InfoFileDto } from "../../mymusic/dto/info.file.dto";

export class ResponseLandingDto {

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

  genreIds: number[];

  files: InfoFileDto[];

  musicFileName: string; // 음악파일명

  isLike: boolean;  // 좋아요 여부

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
}
