import { EntityRepository, getRepository, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { ResponseArtistDto } from "../dto/response.artist.dto";
import { ResponseArtistSongDto } from "../dto/response.artistsong.dto";
import { ResponseArtistHomieDto } from "../dto/response.artisthomie.dto";
import { ResponseArtistFollowerDto } from "../dto/response.artistfollower.dto";
import { Formatter } from "src/util/formatter";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

  async getArtist(artistId: number, userId: number): Promise<ResponseArtistDto> {
    const artistInfo = await getRepository(UserEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userFileEntity', 'uf')
      .leftJoinAndSelect('uf.fileEntity', 'f')
      .leftJoinAndSelect('u.userGenreEntity', 'ug')
      .leftJoinAndSelect('ug.genreEntity', 'g')
      .leftJoinAndSelect('u.userShowtimeEntity', 'us')
      .leftJoinAndSelect('us.showtimeEntity', 's')
      .leftJoinAndSelect('s.showtimeTierEntity', 'st')
      .leftJoinAndSelect('st.showtimeFileEntity', 'stf')
      .leftJoinAndSelect('stf.fileEntity', 'stff')
      .leftJoinAndSelect('s.nftMusicEntity', 'snft')
      .leftJoinAndSelect('st.showtimePurchaseHistoryEntity', 'sph')
      .leftJoinAndSelect('sph.userEntity', 'spu')
      .leftJoinAndSelect('spu.userFileEntity', 'spuf')
      .leftJoinAndSelect('spuf.fileEntity', 'spff')
      .leftJoinAndSelect('u.userFollowerEntity', 'tf')
      .leftJoinAndSelect('tf.followerEntity', 'tfw')
      .leftJoinAndSelect('tfw.userFileEntity', 'tfwuf')
      .leftJoinAndSelect('tfwuf.fileEntity', 'ftfw')
      .where('u.id = :artistId', {artistId: artistId})
      .orderBy('s.id, sph.id', 'DESC')
      .getOne();
    if (!artistInfo) {
      return new ResponseArtistDto();
    }

    const responseArtistDto = new ResponseArtistDto();

    responseArtistDto.artistId = artistId;
    for(const userFile of artistInfo.userFileEntity) {
      if(userFile.fileType == 'PROFILE') {
        responseArtistDto.artistImage = userFile.fileEntity.url;
      } else if(userFile.fileType == 'BANNER') {
        responseArtistDto.artistBannerImage = userFile.fileEntity.url;
      } else {
        responseArtistDto.artistImage = '';
      }
    }
    responseArtistDto.nickname = artistInfo.nickname;
    responseArtistDto.handle = artistInfo.handle;
    responseArtistDto.address = artistInfo.address;
    responseArtistDto.createAt = Formatter.dateFormatter(artistInfo.createdAt);
    responseArtistDto.isFollower = false;
    responseArtistDto.genres = [];
    for(const genre of artistInfo.userGenreEntity) {
      responseArtistDto.genres.push(genre.genreEntity.name);
    }

    responseArtistDto.introduce = artistInfo.introduce;

    responseArtistDto.songs = [];
    responseArtistDto.homies = [];
    responseArtistDto.followers = [];
    for(const userShowtime of artistInfo.userShowtimeEntity) {
      const songDto = new ResponseArtistSongDto();

      for(const showtimeFile of userShowtime.showtimeEntity.showtimeTierEntity[0].showtimeFileEntity) {
        if(showtimeFile.fileType == 'IMAGE') {
          songDto.albumImage = showtimeFile.fileEntity.url;
          break;
        }
      }

      songDto.name = userShowtime.showtimeEntity.name;
      songDto.artist = userShowtime.showtimeEntity.artist;
      songDto.title = userShowtime.showtimeEntity.title;
      songDto.lyrics = userShowtime.showtimeEntity.lyrics;
      songDto.releaseStartAt = Formatter.dateFormatter(userShowtime.showtimeEntity.releaseStartAt);
      songDto.releaseEndAt = Formatter.dateFormatter(userShowtime.showtimeEntity.releaseEndAt);
      songDto.playTime = userShowtime.showtimeEntity.playTime;
      if(userShowtime.showtimeEntity.releaseYn == 'Y') {
        songDto.isAvailable = true;
      } else {
        songDto.isAvailable = false;
      }

      if(userShowtime.showtimeEntity.nftMusicEntity != null) {
        songDto.nftMusicId = Number(userShowtime.showtimeEntity.nftMusicEntity.id);
      }

      for(const tier of userShowtime.showtimeEntity.showtimeTierEntity) {
        for(const file of tier.showtimeFileEntity) {
          if(file.fileType == 'MUSIC') {
            songDto.musicFileUrl = file.fileEntity.url;
          }
        }
      }

      songDto.totalAmount = userShowtime.showtimeEntity.showtimeTierEntity.length;

      let leftAmount = 0;
      for(const showtimeTier of userShowtime.showtimeEntity.showtimeTierEntity) {
        if(showtimeTier.purchaseYn == 'Y') {
          leftAmount++;

          for(const purchase of showtimeTier.showtimePurchaseHistoryEntity) {
            const homieDto = new ResponseArtistHomieDto();
            for(const userFile of purchase.userEntity.userFileEntity) {
              if(userFile.fileType == 'PROFILE') {
                homieDto.userImage = userFile.fileEntity.url;
              } else if(userFile.fileType == 'BANNER') {
                homieDto.userBannerImage = userFile.fileEntity.url;
              } else {
                homieDto.userImage = '';
              }
            }
            homieDto.userHandle = purchase.userEntity.handle;
            homieDto.name = songDto.name;
            homieDto.boughtTier = showtimeTier.tier;
            responseArtistDto.homies.push(homieDto);
          }
        }
        songDto.tokenId = showtimeTier.tokenId;
      }
      songDto.leftAmount = songDto.totalAmount - leftAmount;

      responseArtistDto.songs.push(songDto);
    }

    for(const userFollower of artistInfo.userFollowerEntity) {
      const followerDto = new ResponseArtistFollowerDto();
      if(userFollower.followerEntity.id == userId) {
        responseArtistDto.isFollower = true;
      }
      for(const userFile of userFollower.followerEntity.userFileEntity) {
        if(userFile.fileType == 'PROFILE') {
          followerDto.userImage = userFile.fileEntity.url;
        } else if(userFile.fileType == 'BANNER') {
          followerDto.userBannerImage = userFile.fileEntity.url;
        } else {
          followerDto.userImage = '';
        }
      }
      followerDto.userHandle = userFollower.followerEntity.handle;
      followerDto.address = userFollower.followerEntity.address;
      responseArtistDto.followers.push(followerDto);
    }

    return responseArtistDto;
  }
}
