import { InfoFileDto } from "../../mymusic/dto/info.file.dto";
import {ResponseUserInfoDto} from "../../showtime/dto/response.userinfo.dto";

export class ResponseArtistDetailDto {
  title: string; // 앨범타이틀

  name: string; // 노래제목

  artist: string; // 아티스트

  musicFileUrl: string; // 음악파일URL

  imgFileUrl: string; // 이미지파일URL

  playTime: number; // 재생시간

  playCount: number; // 누적 플레이 시간

  source: string;

  handle: string;

  showtimeId: number;
}
