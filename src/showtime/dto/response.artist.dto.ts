import { ResponseArtistSongDto } from "./response.artistsong.dto";
import { ResponseArtistHomieDto } from "./response.artisthomie.dto";
import { ResponseArtistFollowerDto } from "./response.artistfollower.dto";

export class ResponseArtistDto {

  artistId: number;

  artistImage: string;

  nickname: string;

  handle: string;

  address: string;

  createAt: string;

  genres: string[];

  introduce: string;

  isFollower: boolean;

  songs: ResponseArtistSongDto[];

  homies: ResponseArtistHomieDto[];

  followers: ResponseArtistFollowerDto[];

  isComingsoon: boolean;

  remainCount: number;

}
