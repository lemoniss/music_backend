import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ShowtimeEntity } from "./showtime.entity";
import { NftMusicGenreEntity } from "./nftmusic_genre.entity";
import { NftMusicFileEntity } from "./nftmusic_file.entity";
import { NftMusicLikeEntity } from "./nftmusic_like.entity";

@Entity({ name: 'nft_music' })
export class NftMusicEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '내가만든음원 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'ipfs_hash', length: 100, comment: 'IPFS해시' })
  ipfsHash: string;

  @Column({ type: 'varchar', name: 'title', length: 50, comment: '제목' })
  title: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
  name: string;

  @Column({ type: 'varchar', name: 'artist', length: 50, comment: '아티스트명' })
  artist: string;

  @Index()
  @Column({ type: 'varchar', name: 'handle', length: 50, comment: '핸들' })
  handle: string;

  @Column({ type: 'varchar', name: 'description', length: 4000, comment: '설명' })
  description: string;

  @Column({ type: 'varchar', name: 'lyrics', length: 4000, comment: '가사', nullable: true })
  lyrics: string;

  @Column({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
  playTime: number;

  @Column({ type: 'bigint', name: 'play_count', comment: '음원재생횟수' })
  playCount: number;

  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT Token ID' })
  tokenId: string;

  @Column({ type: 'varchar', name: 'minter', length: 50, comment: '최초발행자 지갑주소' })
  minter: string;

  @Column({ type: 'char', name: 'is_on_sale', length: 1, comment: '판매여부' })
  isOnSale: string;

  @Column({ type: 'varchar', name: 'source', length: 50, comment: '출처' })
  source: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.nftMusicEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @OneToMany(() => NftMusicFileEntity, nftMusicFileEntity => nftMusicFileEntity.nftMusicEntity)
  nftMusicFileEntity: NftMusicFileEntity[];

  @OneToMany(() => NftMusicGenreEntity, nftMusicGenreEntity => nftMusicGenreEntity.nftMusicEntity)
  nftMusicGenreEntity: NftMusicGenreEntity[];

  @OneToMany(() => NftMusicLikeEntity, nftMusicLikeEntity => nftMusicLikeEntity.nftMusicEntity)
  nftMusicLikeEntity: NftMusicLikeEntity[];

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부', default: 'Y' })
  viewYn: string;
}
