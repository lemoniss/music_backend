import { ForbiddenException, Injectable, } from "@nestjs/common";
import { ShowtimeRepository } from "../showtime/repository/showtime.repository";
import { L2eRepository } from "../l2e/repository/l2e.repository";
import { NftMusicRepository } from "../nftmusic/repository/nftmusic.repository";
import { ShowtimeCrewRepository } from "../showtime/repository/showtime_crew.repository";
import { SortNftDto } from "../nftmusic/dto/sort.nft.dto";
import { UserRepository } from "../user/repository/user.repository";
import { ShowtimeHolderRepository } from "../showtime/repository/showtime_holder.repository";
import { BannerRepository } from "../showtime/repository/banner.repository";

const crypto = require("crypto");
const fs = require('fs');

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
        const userInfo = await this.userRepository.findByAddress('0x6bb48e350fb163450a8639b311f5e4d9e290c0ae');


        if(userInfo.id == 0) {
          throw new ForbiddenException();
          return false;
        }

        response.newRelease = await this.nftMusicRepository.findNftListTake(5);
        const sortNftDto = new SortNftDto();
        sortNftDto.userId = userInfo.id.toString();
        sortNftDto.take = 7;
        response.likes = await this.nftMusicRepository.findNftLikeList(sortNftDto);
        const recentPlayed = [];
        const played = await this.l2eRepository.getRecentPlayed(userInfo.id, 15);

        for(const recent of played) {
          const info = await this.nftMusicRepository.findNftToTokenIdAndSource(recent.tokenId, recent.source, recent.totalSecond);
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

      } catch (e) {
        throw new ForbiddenException();
        return false;
      }
    } else {  // 로그인 안함
      response.newRelease = await this.nftMusicRepository.findNftListTake(9);

    }

    const streamingTop50 = [];

    const l2eTop50 = await this.l2eRepository.getStreamingTop(50);
    for(const l2eInfo of l2eTop50) {
      const info = await this.nftMusicRepository.findNftToTokenIdAndSource(l2eInfo.tokenId, l2eInfo.source, l2eInfo.totalSecond);
      streamingTop50.push(info);
    }

    response.streamingTop50 = streamingTop50;

    response.showtime = await this.showtimeRepository.getLandingRecents(15);

    const upcoming = [];
    const upcomingArtists = await this.userRepository.getArtists(0, 999999);
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
    response.showtimeArtists = await this.userRepository.getArtists(0, 20);
    response.serverTime = await this.showtimeRepository.getServertime();
    return response;
  }

  async getLandingArtistsDatas(skip: number): Promise<any> {

    let response: any = {};

    response.showtimeArtists = await this.userRepository.getArtists(skip, 20);
    return response;
  }

  async getLandingViewsong(source: string, musicId: number): Promise<any> {

    let response: any = {};

    if(source == 'showtime') {
      response = await this.showtimeRepository.getLandingRecent(musicId);
    } else {
      response = await this.nftMusicRepository.getLandingNft(musicId);
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

    response.releases = await this.showtimeRepository.getLandingRecentByArtist(userId);
    response.fellaz = await this.showtimeRepository.getLandingFellazByArtist(userId, 0);

    const showtimeList = await this.showtimeHolderRepository.getLandingHolderShowtimes(userId);
    console.log('1234')
    const nftList = await this.nftMusicRepository.getLandingMyNftList(userId); //TODO: playCount 수정
    console.log(response.fellaz)
    response.collection = showtimeList.concat(nftList);

    // 내 플레이리스트 가져오기
    let sortNftDto = new SortNftDto();
    sortNftDto.userId = userId.toString();
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

    response.fellaz = await this.showtimeRepository.getLandingFellazByArtist(userId, skip);
    return response;
  }
}
