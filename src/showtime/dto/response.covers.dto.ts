import { ResponsePurchasehistoryDto } from "./response.purchasehistory.dto";
import { ResponseMembershipDto } from "./response.membership.dto";
import { ResponseIdHandleDto } from "./response.idhandle.dto";

export class ResponseCoversDto {

  showtimeId: number;

  artistId: number;

  artistImage: string;

  name: string;

  artist: string;

  title: string;

  handle: string;

  musicFileUrl: string; // 음악파일URL

  imgFileUrl: string; // 이미지파일URL

  genres: string;

  totalLikeCount: number;

  isLike: boolean;

  floorPrice: number;

  floorCnutAmount: number;

  nftGrabs: number;

  nftDrops: number;

  releaseYn: string;

  releaseStartAt: string;

  releaseEndAt: string;

  membership: ResponseMembershipDto[];

  artistHandle: ResponseIdHandleDto[];

  producerHandle: ResponseIdHandleDto[];

  description: string;

  transactionHash: string;

  ipfsHash: string;

  provenance: ResponsePurchasehistoryDto[];

  nftMusicId: number;

  lyrics: string;

  isNftMusicLike: boolean;

  movieUrl: string[];

  tokenId: string;

  source: string;
}
