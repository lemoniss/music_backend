// import { EntityRepository, getRepository, Repository } from "typeorm";
// import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
// import { NftMusicEntity } from "../entity/nftmusic.entity";
// import { CreateNftDto } from "../dto/create.nft.dto";
// import { InfoMusicDto } from "../../mymusic/dto/info.music.dto";
// import { InfoNftDto } from "../dto/info.nft.dto";
// import { SortDashboardDto } from "../dto/sort.dashboard.dto";
//
// // 상황 봐서 수정 고고
//
// @EntityRepository(NftMusicEntity)
// export class DashboardMusicRepository extends Repository<NftMusicEntity> {
//
//   /**
//    * 음악 정보 생성
//    * @param createUserDto
//    */
//   async createNft(createNftDto: CreateNftDto, ipfsHash: string, infoMusicDto: InfoMusicDto): Promise<number> {
//     try {
//       const nftMusic = await this.save({
//         ipfsHash: ipfsHash,
//         title: infoMusicDto.title,
//         name: infoMusicDto.name,
//         artist: infoMusicDto.artist,
//         description: infoMusicDto.description,
//         playTime: infoMusicDto.playTime,
//         playCount: 0,
//       });
//
//       return nftMusic.id;
//     } catch (e) {
//       throw new RuntimeException('Server Error. Please try again later.');
//     }
//   }
//
//   /**
//    * 음악 리스트 (검색도 있음)
//    * @param keyword
//    */
//   async findNftList(sortDashboardDto: SortDashboardDto): Promise<InfoNftDto[]> {
//
//     const nftList = await getRepository(NftMusicEntity)
//       .createQueryBuilder('m')
//       .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
//       .innerJoinAndSelect('mf.fileEntity', 'f')
//       .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
//       .innerJoinAndSelect('mg.genreEntity', 'g')
//       .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
//       .where(typeof sortDashboardDto.search != 'undefined' ? 'm.name like :keyword' : '1 = 1', {keyword: `%${sortDashboardDto.search}%`})
//       .orderBy(`m.${sortDashboardDto.sortType}`, 'DESC')
//       .getMany();
//
//
//     if (!nftList) {
//       throw new RuntimeException('Music Not Found');
//     }
//     const infoNftDtos = [];
//
//     let i:number = 1;
//     for(const nftEntity of nftList) {
//       const infoNftDto = new InfoNftDto();
//
//       infoNftDto.nftMusicId = nftEntity.id;
//       infoNftDto.title = nftEntity.title;
//       infoNftDto.name = nftEntity.name;
//       infoNftDto.artist = nftEntity.artist;
//       infoNftDto.description = nftEntity.description;
//       infoNftDto.playTime = nftEntity.playTime;
//
//       // 여기랑 좋아요 목록 받아오는 것 부터 하기
//
//       for(const nftFileEntity of nftEntity.nftMusicFileEntity) {
//         switch (nftFileEntity.fileType) {
//           case 'MUSIC':
//             infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
//             break;
//           case 'IMAGE':
//             infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
//             break;
//         }
//       }
//
//       let genres = '';
//       for(const nftGenreEntity of nftEntity.nftMusicGenreEntity) {
//         genres += nftGenreEntity.genreEntity.name + ', '
//       }
//       infoNftDto.genres = genres.substring(0, genres.length-2);
//       infoNftDtos.push(infoNftDto);
//
//       if(i == sortDashboardDto.limitNumber){
//         break;
//       }
//       i++;
//     }
//     return infoNftDtos;
//   }
//
// }
