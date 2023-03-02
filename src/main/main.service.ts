import { ForbiddenException, Injectable, } from "@nestjs/common";
import { ShowtimeRepository } from "../showtime/repository/showtime.repository";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";
import { ShowtimeCrewRepository } from "../showtime/repository/showtime_crew.repository";
import { SortNftDto } from "../nftmusic/dto/sort.nft.dto";
import { UserRepository } from "../user/repository/user.repository";
import { ShowtimeHolderRepository } from "../showtime/repository/showtime_holder.repository";
import { BannerRepository } from "../showtime/repository/banner.repository";
import { Rsa } from "../util/rsa";


@Injectable()
export class MainService {
  constructor(
    private showtimeRepository: ShowtimeRepository,
    private l2eRepository: L2eRepository,
    private nftMusicRepository: NftMusicRepository,
    private showtimeCrewRepository: ShowtimeCrewRepository,
    private userRepository: UserRepository,
    private showtimeHolderRepository: ShowtimeHolderRepository,
    private bannerRepository: BannerRepository,
  ) {}

  async getMainDatas(authToken: string): Promise<any> {
    let response: any = {};

    if(typeof authToken != 'undefined') {   // header 에 값이 있다. 로그인 검증해야함
      try {
        // const privateKey = fs.readFileSync('./private_key.pem', {encoding: 'utf-8'});
        // const decryptToken = crypto.privateDecrypt(
        //   {
        //     key: privateKey,
        //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        //     oaepHash: 'sha256',
        //     oaepLabel: 'millim-x_webapp',
        //   }, Buffer.from(authToken, 'base64')
        // );
        // const decryptTokenStr = Buffer.from(decryptToken.buffer).toString();
        // const map = new Map(Object.entries(JSON.parse(decryptTokenStr)));
        //
        // const userInfo = await this.userRepository.findByAddress(map.get('address').toString());

        /**
         * TODO : react에서 rsa암호화를 해서 주소를 보내주면 윗 주석으로 처리하자
         */
        // const userInfo = await this.userRepository.findByAddress('0x6bb48e350fb163450a8639b311f5e4d9e290c0ae');
        const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

        if(userInfo.id == 0) {
          throw new ForbiddenException();
          return false;
        }

        response.connectorInfo = userInfo;

        const skipTakeDto = new SortNftDto();
        skipTakeDto.skip = 0;
        skipTakeDto.take = 5;
        response.newRelease = await this.nftMusicRepository.findNftListTake(skipTakeDto);
        const sortNftDto = new SortNftDto();
        sortNftDto.userId = userInfo.id;
        sortNftDto.take = 7;
        response.likes = await this.nftMusicRepository.findNftListTake(sortNftDto);
        const recentPlayed = [];
        const recentDto = new SortNftDto();
        recentDto.userId = userInfo.id;
        recentDto.take = 15;
        recentDto.skip = 0;
        const played = await this.l2eRepository.getRecentPlayed(recentDto);

        for(const recent of played) {
          const info = await this.nftMusicRepository.findNftToToIdAndSource(userInfo.id, recent.musicId, recent.source, recent.totalSecond);
          recentPlayed.push(info);
        }
        response.recentPlayed = recentPlayed;

        const myLikes = response.likes.slice(); // deep copy

        if(myLikes.length > 5) {
          for(let i=5; i< myLikes.length; i++) {
            myLikes.splice(i);
          }
        }

        response.myLikes = myLikes;

        const streamingTop50 = [];
        const streamingDto = new SortNftDto();
        streamingDto.skip = 0;
        streamingDto.take = 50;
        const l2eTop50 = await this.l2eRepository.getStreamingTop(streamingDto);
        for(const l2eInfo of l2eTop50) {
          const info = await this.nftMusicRepository.findNftToToIdAndSource(userInfo.id, l2eInfo.musicId, l2eInfo.source, l2eInfo.totalSecond);
          streamingTop50.push(info);
        }
        response.streamingTop50 = streamingTop50;

      } catch (e) {
        throw new ForbiddenException();
        return false;
      }
    } else {  // 로그인 안함
      const skipTakeDto = new SortNftDto();
      skipTakeDto.skip = 0;
      skipTakeDto.take = 9;
      response.newRelease = await this.nftMusicRepository.findNftListTake(skipTakeDto);

      const streamingTop50 = [];
      const streamingDto = new SortNftDto();
      streamingDto.skip = 0;
      streamingDto.take = 50;
      const l2eTop50 = await this.l2eRepository.getStreamingTop(streamingDto);
      for(const l2eInfo of l2eTop50) {
        const info = await this.nftMusicRepository.findNftToToIdAndSource(0, l2eInfo.musicId, l2eInfo.source, l2eInfo.totalSecond);
        streamingTop50.push(info);
      }
      response.streamingTop50 = streamingTop50;
    }



    const showtimeDto = new SortNftDto();
    showtimeDto.skip = 0;
    showtimeDto.take = 50;
    response.showtime = await this.showtimeRepository.getLandingRecents(showtimeDto);

    const upcoming = [];
    let artistDto = new SortNftDto();
    artistDto.skip = 0;
    artistDto.take = 999999;
    const upcomingArtists = await this.userRepository.getArtists(artistDto);
    for(const upcomingArtist of upcomingArtists) {
      if(upcomingArtist.isComingsoon) upcoming.push(upcomingArtist);
    }
    response.upcoming = upcoming;

    const banners = await this.bannerRepository.getLaunchAppBanners('ko');

    const whosHot = [];
    const mostLiked = [];

    for(const banner of banners) {
      banner.type === 'W' ? whosHot.push(banner) : mostLiked.push(banner);
    }

    response.whosHot = whosHot;
    response.mostLiked = mostLiked;

    const musitByGenre = [];

    const genreId = ['1,3', '2', '8', '6', '12', '16', '5', '17', '18'];
    const genreName = ['Pop & K-Pop', 'Hiphop', 'Electronic', 'Rock', 'Jazz', 'Classical', 'Funk', 'Instrumental', 'Other'];

    for(let i=0; i<9; i++) {
      const obj = {
        id: undefined,
        name: undefined,
      };
      obj.id = genreId[i];
      obj.name = genreName[i];
      musitByGenre.push(obj);
    }

    response.musitByGenre = musitByGenre;
    let sortNftDto = new SortNftDto();
    sortNftDto.skip = 0;
    sortNftDto.take = 20;
    response.showtimeArtists = await this.userRepository.getArtists(sortNftDto);
    response.serverTime = await this.showtimeRepository.getServertime();
    return response;
  }

  async getLandingArtistsDatas(skip: number): Promise<any> {

    let response: any = {};
    // 내 플레이리스트 가져오기
    let sortNftDto = new SortNftDto();
    sortNftDto.skip = skip;
    sortNftDto.take = 20;
    response.showtimeArtists = await this.userRepository.getArtists(sortNftDto);
    return response;
  }

  async getMainViewsong(authToken: string, source: string, musicId: number): Promise<any> {

    let response: any = {};

    if(typeof authToken != 'undefined') {   // header 에 값이 있다. 로그인 검증해야함
      try {
        const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

        if(userInfo.id == 0) {
          throw new ForbiddenException();
          return false;
        }

        response.connectorInfo = userInfo;
      } catch (e) {
        throw new ForbiddenException();
        return false;
      }
    }

    if(source == 'showtime') {
      response.viewsongInfo = await this.showtimeRepository.getLandingRecent(musicId);
    } else {
      response.viewsongInfo = await this.nftMusicRepository.getLandingNft(musicId);
    }

    response.serverTime = await this.showtimeRepository.getServertime();

    return response;
  }

  async getMainArtistInfo(authToken: string, handle: string): Promise<any> {
    let response: any = {};

    if(typeof authToken != 'undefined') {   // header 에 값이 있다. 로그인 검증해야함
      try {
        const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

        if(userInfo.id == 0) {
          throw new ForbiddenException();
          return false;
        }

        response.connectorInfo = userInfo;
      } catch (e) {
        throw new ForbiddenException();
        return false;
      }
    }

    const handleResponse = await this.userRepository.findByHandle(handle);
    const userId = handleResponse.id;
    response.artistInfo = await this.userRepository.findById(userId);
    response.followingInfo = {following: "N/A", follower: "N/A"};

    const showtimeRelease = await this.showtimeRepository.getRecentByArtist(userId);
    const nftRelease = await this.nftMusicRepository.getRecentByMinter(handleResponse.address);
    response.releases = showtimeRelease.concat(nftRelease);


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

  async getSearchResult(authToken: string, keyword: string): Promise<any> {
    let response: any = {};

    if(typeof authToken != 'undefined') {   // header 에 값이 있다. 로그인 검증해야함
      try {
        const userInfo = await this.userRepository.findByAddress(Rsa.decryptAddress(authToken));

        if(userInfo.id == 0) {
          throw new ForbiddenException();
          return false;
        }

        response.connectorInfo = userInfo;
      } catch (e) {
        throw new ForbiddenException();
        return false;
      }
    }
    let sortNftDto = new SortNftDto();
    sortNftDto.keyword = keyword;
    sortNftDto.skip = 0;
    sortNftDto.take = 10;

    response.songs = await this.nftMusicRepository.findNftListTake(sortNftDto);
    response.artists = await this.userRepository.getArtists(sortNftDto);
    return response;
  }

  async getSearchResultForSongsMore(keyword: string, skip: number): Promise<any> {
    let response: any = {};
    let sortNftDto = new SortNftDto();
    sortNftDto.keyword = keyword;
    sortNftDto.skip = skip;
    sortNftDto.take = 10;

    response.songs = await this.nftMusicRepository.findNftListTake(sortNftDto);
    return response;
  }

  async getSearchResultForArtistsMore(keyword: string, skip: number): Promise<any> {
    let response: any = {};
    let sortNftDto = new SortNftDto();
    sortNftDto.keyword = keyword;
    sortNftDto.skip = skip;
    sortNftDto.take = 10;

    response.artists = await this.userRepository.getArtists(sortNftDto);
    return response;
  }
}
