import { ResponseUserInfoDto } from "./response.userinfo.dto";
import { ResponseNftInfoDto } from "./response.nftinfo.dto";
import { ResponseSongInfoDto } from "./response.songinfo.dto";
import { ResponseContractInfoDto } from "./response.contractinfo.dto";

export class ResponseRecentWebDto {

  showtimeId: number;

  nftMusicId: number;

  title: string;

  name: string;

  artist: string;

  description: string;

  lyrics: string;

  releaseYn: string;

  releaseStartAt: string;

  releaseEndAt: string;

  songInfo: ResponseSongInfoDto;

  nftInfo: ResponseNftInfoDto;

  artists: ResponseUserInfoDto[];

  producers: ResponseUserInfoDto[];

  nftDrops: ResponseNftInfoDto[];

  fellaz: ResponseUserInfoDto[];

  contractInfo: ResponseContractInfoDto;

  imgFileUrl: string;

  musicFileUrl: string;

  isOnSale: string;
}
