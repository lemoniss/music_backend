import { IsOptional } from "class-validator";

export class InfoUpcomingDto {

  showtimeId: number;

  name: string;

  artist: string;

  title: string;

  handle: string;

  description: string;

  playTime: number;

  musicFileId: number;  // 음악파일id

  imgFileId: number;  // 앨범커버이미지id

  tokenId: string;  // tokenId

  ipfsHash: string;  // ipfs_hash

  @IsOptional()
  genreIds: number[];
}
