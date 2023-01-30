export class CreateNftDto {

  title: string; // 앨범타이틀

  name: string; // 노래제목

  artist: string; // 아티스트

  description: string; // 설명

  playTime: number; // playtime

  musicFileId: number;  // 음악파일id

  imgFileId: number;  // 앨범커버이미지id

  tokenId: string;  // tokenId

  ipfsHash: string;  // ipfs_hash

  genreIds: number[];

  showtimeId: number;

  handle: string;
}
