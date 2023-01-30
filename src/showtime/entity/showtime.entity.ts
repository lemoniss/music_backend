import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ShowtimeGenreEntity } from "./showtime_genre.entity";
import { NftMusicEntity } from "./nftmusic.entity";
import { ShowtimeTierEntity } from "./showtime_tier.entity";
import { UserShowtimeEntity } from "./user_showtime.entity";
import { ShowtimeDistributorEntity } from "./showtime_distributor.entity";
import { ShowtimeCrewEntity } from "./showtime_crew.entity";
import { ShowtimeLikeEntity } from "./showtime_like.entity";
import { ShowtimeMovieEntity } from "./showtime_movie.entity";

@Entity({ name: 'showtime' })
export class ShowtimeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '내가만든음원 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 50, comment: '앨범명' })
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

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
  viewYn: string;

  @Column({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
  playTime: number;

  @Column({ type: 'bigint', name: 'play_count', comment: '음원재생횟수' })
  playCount: number;

  @Column({ type: 'bigint', name: 'like_count', comment: '좋아요 휫수' })
  likeCount: number;

  @Column({ type: 'varchar', name: 'minter', length: 50, comment: '최초발행자 지갑주소' })
  minter: string;

  @Column({ type: 'varchar', name: 'transaction_hash', length: 100, comment: '쇼타임 txHash' })
  transactionHash: string;

  @Column({ type: 'char', name: 'release_yn', length: 1, comment: '릴리즈 YN' })
  releaseYn: string;

  @CreateDateColumn({ type: 'datetime', name: 'release_start_at', comment: '릴리즈시작일시' })
  releaseStartAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'release_end_at', comment: '릴리즈시작일시', nullable: true})
  releaseEndAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => ShowtimeGenreEntity, showtimeGenreEntity => showtimeGenreEntity.showtimeEntity)
  showtimeGenreEntity: ShowtimeGenreEntity[];

  @OneToMany(() => ShowtimeTierEntity, showtimeTierEntity => showtimeTierEntity.showtimeEntity)
  showtimeTierEntity: ShowtimeTierEntity[];

  @OneToMany(() => ShowtimeDistributorEntity, showtimeDistributorEntity => showtimeDistributorEntity.showtimeEntity)
  showtimeDistributorEntity: ShowtimeDistributorEntity[];

  @OneToMany(() => UserShowtimeEntity, userShowtimeEntity => userShowtimeEntity.showtimeEntity)
  userShowtimeEntity: UserShowtimeEntity[];

  @OneToOne(() => NftMusicEntity, nftMusicEntity => nftMusicEntity.showtimeEntity)
  nftMusicEntity: NftMusicEntity;

  @OneToMany(() => ShowtimeCrewEntity, showtimeCrewEntity => showtimeCrewEntity.showtimeEntity)
  showtimeCrewEntity: ShowtimeCrewEntity[];

  @OneToMany(() => ShowtimeLikeEntity, showtimeLikeEntity => showtimeLikeEntity.showtimeEntity)
  showtimeLikeEntity: ShowtimeLikeEntity[];

  @OneToMany(() => ShowtimeMovieEntity, showtimeMovieEntity => showtimeMovieEntity.showtimeEntity)
  showtimeMovieEntity: ShowtimeMovieEntity[];
}
