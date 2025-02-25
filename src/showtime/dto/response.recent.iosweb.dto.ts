import { ResponsePurchasehistoryDto } from "./response.purchasehistory.dto";
import { ResponseMembershipDto } from "./response.membership.dto";
import { ResponseIdHandleDto } from "./response.idhandle.dto";

export class ResponseRecentIosWebDto {

  showtimeId: number;

  artistId: number;

  artistImage: string;

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

  transactionHash: string;

  ipfsHash: string;

  provenance: ResponsePurchasehistoryDto[];

  musicId: number;

  musicFileUrl: string;

  lyrics: string;
}
