import { ResponseMembershipDto } from "./response.membership.dto";
import { ResponseIdHandleDto } from "./response.idhandle.dto";

export class ResponseUpcomingDto {

  showtimeId: number;

  artistId: number;

  artistImage: string;

  artistBannerImage: string;

  name: string;

  artist: string;

  title: string;

  handle: string;

  genres: string;

  totalLikeCount: number;

  isLike: boolean;

  floorPrice: number;

  nftDrops: number;

  dropType: number;

  releaseStartAt: string;

  releaseEndAt: string;

  membership: ResponseMembershipDto[];

  artistHandle: ResponseIdHandleDto[];

  producerHandle: ResponseIdHandleDto[];

  description: string;

  playTime: number;

  releaseYn: string;

  lyrics: string;
}
