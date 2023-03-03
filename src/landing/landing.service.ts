import { Injectable } from "@nestjs/common";
import { ShowtimeRepository } from "../showtime/repository/showtime.repository";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";
import { ShowtimeCrewRepository } from "../showtime/repository/showtime_crew.repository";
import { SortNftDto } from "../nftmusic/dto/sort.nft.dto";
import { UserRepository } from "../user/repository/user.repository";
import { ShowtimeHolderRepository } from "../showtime/repository/showtime_holder.repository";

@Injectable()
export class LandingService {
  constructor(
    private showtimeRepository: ShowtimeRepository,
    private l2eRepository: L2eRepository,
    private nftMusicRepository: NftMusicRepository,
    private showtimeCrewRepository: ShowtimeCrewRepository,
    private userRepository: UserRepository,
    private showtimeHolderRepository: ShowtimeHolderRepository,
  ) {}

  async getLandingDatas(): Promise<any> {

    let response: any = {};

    const streamingTop15 = [];

    const streamingDto = new SortNftDto();
    streamingDto.skip = 0;
    streamingDto.take = 15;
    const l2eTop15 = await this.l2eRepository.getStreamingTop(streamingDto);
    for(const l2eInfo of l2eTop15) {
      const info = await this.nftMusicRepository.findNftToToIdAndSource(0, l2eInfo.musicId, l2eInfo.source, l2eInfo.totalSecond);
      streamingTop15.push(info);
    }

    response.showtimeCovers = await this.showtimeRepository.getLandingCovers();
    const showtimeDto = new SortNftDto();
    showtimeDto.skip = 0;
    showtimeDto.take = 15;
    response.showtimePresents = await this.showtimeRepository.getLandingRecents(0, showtimeDto);
    response.streamingTop = streamingTop15;
    const skipTakeDto = new SortNftDto();
    skipTakeDto.skip = 0;
    skipTakeDto.take = 9;
    response.newRelease = await this.nftMusicRepository.findNftListTake(skipTakeDto);
    let artistDto = new SortNftDto();
    artistDto.skip = 0;
    artistDto.take = 20;
    response.showtimeArtists = await this.userRepository.getArtists(artistDto);
    response.serverTime = await this.showtimeRepository.getServertime();
    return response;
  }

  async getLandingArtistsDatas(skip: number): Promise<any> {

    let response: any = {};
    let sortNftDto = new SortNftDto();
    sortNftDto.skip = skip;
    sortNftDto.take = 20;
    response.showtimeArtists = await this.userRepository.getArtists(sortNftDto);
    return response;
  }

  async getLandingViewsong(source: string, musicId: number): Promise<any> {

    let response: any = {};

    if(source == 'showtime') {
      response = await this.showtimeRepository.getLandingRecent(0, musicId);
    } else {
      response = await this.nftMusicRepository.getLandingNft(0, musicId);
    }

    response.serverTime = await this.showtimeRepository.getServertime();

    return response;
  }

  async getLandingArtistInfo(handle: string): Promise<any> {
    let response: any = {};

    const handleResponse = await this.userRepository.findByHandle(handle);
    const userId = handleResponse.id;
    response.artistInfo = await this.userRepository.findById(userId);
    response.followingInfo = {following: "N/A", follower: "N/A"};

    response.releases = await this.showtimeRepository.getRecentByArtist(userId);
    response.fellaz = await this.showtimeRepository.getFellazByArtist(userId, 0);

    const showtimeList = await this.showtimeHolderRepository.getLandingHolderShowtimes(userId);

    const nftList = await this.nftMusicRepository.getLandingMyNftList(userId); //TODO: playCount 수정

    response.collection = showtimeList.concat(nftList);

    // 내 플레이리스트 가져오기
    let sortNftDto = new SortNftDto();
    sortNftDto.userId = userId;
    sortNftDto.keyword = '';
    sortNftDto.genreIds = [];
    sortNftDto.sortType = 'id'

    response.playlist = [];
    let playlistObject;
    let myMix = await this.nftMusicRepository.findNftLikeList(sortNftDto);
    if(myMix.length > 0) {
      playlistObject = {playlistName: "My Mix", playlistSongs: myMix};
      response.playlist.push(playlistObject);
    }

    //TODO: 커스텀 플레이리스트 추가하는 로직 나중에 추가하면 됨

    // 나중에
    response.pic = [];
    response.video = [];

    return response;

  }

  async getLandingFellazByArtist(handle: string, skip: number): Promise<any> {

    const handleResponse = await this.userRepository.findByHandle(handle);
    const userId = handleResponse.id;

    let response: any = {};

    response.fellaz = await this.showtimeRepository.getFellazByArtist(userId, skip);
    return response;
  }
}
