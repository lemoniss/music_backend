import { InfoDistributorDto } from "./info.distributor.dto";
import { InfoRareDto } from "./info.rare.dto";

export class ResponseShowtimeIpfsDto {

  name: string;

  artist: string;

  title: string;

  handle: string;

  genreIds: number[];

  description: string;

  musicFileId: number;

  playTime: number;

  imageFileId: number;

  rares: InfoRareDto[];

  no: number;

  tier: string;

  price: number;

  ipfsHash: string;

  releaseStartAt: string;

  releaseEndAt: string;

  releaseYn: string;

  distributors: InfoDistributorDto[];

  tokenId: string;

  tierDescription: string;

  lyrics: string;
}
