import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { UserShowtimeEntity } from "./user_showtime.entity";
import { ShowtimePurchaseHistoryEntity } from "./showtime_purchasehistory.entity";
import { ShowtimeCrewEntity } from "./showtime_crew.entity";
import { ShowtimeLikeEntity } from "./showtime_like.entity";
import { UserFileEntity } from "./user_file.entity";
import { UserGenreEntity } from "./user_genre.entity";
import { ShowtimeHolderEntity } from "./showtime_holder.entity";
import { NftMusicLikeEntity } from "./nftmusic_like.entity";
import { BannerLikeEntity } from "./banner_like.entity";
import { ShowtimeMovieEntity } from "./showtime_movie.entity";
import { UserFollowerEntity } from "./user_follower.entity";

@Entity({ name: 'user' })
@Unique(['address', 'handle'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '사용자식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'address', length: 50, comment: '지갑주소' })
  address: string;

  @Column({ type: 'varchar', name: 'nickname', length: 50, comment: '닉네임' })
  nickname: string;

  @Column({ type: 'varchar', name: 'handle', length: 50, comment: '핸들' })
  handle: string;

  @Column({ type: 'varchar', name: 'introduce', length: 2000, comment: '내소개글' })
  introduce: string;

  @Column({ type: 'varchar', name: 'lang', length: 50, comment: '최초 디바이스에 정의된 언어' })
  lang: string;

  @Column({ type: 'varchar', name: 'nation', length: 50, comment: '최초 디바이스에 정의된 국적' })
  nation: string;

  @Column({ type: 'varchar', name: 'device', length: 50, comment: '최초 디바이스' })
  device: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => UserShowtimeEntity, userShowtimeEntity => userShowtimeEntity.userEntity)
  userShowtimeEntity: UserShowtimeEntity[];

  @OneToMany(() => ShowtimePurchaseHistoryEntity, showtimePurchaseHistoryEntity => showtimePurchaseHistoryEntity.userEntity)
  showtimePurchaseHistoryEntity: ShowtimePurchaseHistoryEntity[];

  @OneToMany(() => ShowtimeHolderEntity, showtimeHolderEntity => showtimeHolderEntity.userEntity)
  showtimeHolderEntity: ShowtimeHolderEntity[];

  @OneToMany(() => ShowtimeCrewEntity, showtimeCrewEntity => showtimeCrewEntity.userEntity)
  showtimeCrewEntity: ShowtimeCrewEntity[];

  @OneToMany(() => ShowtimeLikeEntity, showtimeLikeEntity => showtimeLikeEntity.userEntity)
  showtimeLikeEntity: ShowtimeLikeEntity[];

  @OneToMany(() => UserFileEntity, userFileEntity => userFileEntity.userEntity)
  userFileEntity: UserFileEntity[];

  @OneToMany(() => UserGenreEntity, userGenreEntity => userGenreEntity.userEntity)
  userGenreEntity: UserGenreEntity[];

  @OneToMany(() => UserFollowerEntity, userFollowerEntity => userFollowerEntity.userEntity)
  userFollowerEntity: UserFollowerEntity[];

  @OneToMany(() => UserFollowerEntity, targetFollowerEntity => targetFollowerEntity.followerEntity)
  targetFollowerEntity: UserFollowerEntity[];

  @OneToMany(() => NftMusicLikeEntity, nftMusicLikeEntity => nftMusicLikeEntity.userEntity)
  nftMusicLikeEntity: NftMusicLikeEntity[];

  @OneToMany(() => BannerLikeEntity, bannerLikeEntity => bannerLikeEntity.userEntity)
  bannerLikeEntity: BannerLikeEntity[];

  @OneToMany(() => ShowtimeMovieEntity, showtimeMovieEntity => showtimeMovieEntity.userEntity)
  showtimeMovieEntity: ShowtimeMovieEntity[];
}
