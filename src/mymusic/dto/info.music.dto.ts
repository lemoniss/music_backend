import { InfoFileDto } from "./info.file.dto";

export class InfoMusicDto {

  myMusicId: number;  // 음악생성 식별자

  title: string; // 앨범타이틀

  name: string; // 노래제목

  artist: string; // 아티스트

  genres: string;  // 장르 파싱한 데이터

  description: string; // 설명

  musicFileUrl: string; // 음악파일URL

  imgFileUrl: string; // 이미지파일URL

  playTime: number; // 재생시간

  genreIds: number[];

  files: InfoFileDto[];

  musicFileName: string; // 음악파일명

  handle: string;

  lyrics: string;

  status: string;

  userId: number;
}
