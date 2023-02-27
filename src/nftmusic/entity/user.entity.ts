import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { UserNftMusicEntity } from "./user_nftmusic.entity";
import { NftMusicLikeEntity } from "./nftmusic_like.entity";
import { UserFileEntity } from "./user_file.entity";
import { NftHistoryEntity } from "./nfthistory.entity";
import { NftMusicDistributorEntity } from "./nftmusic_distributor.entity";
import { NftMusicFavoritesEntity } from "./nftmusic_favorites.entity";

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

  @OneToMany(() => UserNftMusicEntity, userNftMusicEntity => userNftMusicEntity.userEntity)
  userNftMusicEntity: UserNftMusicEntity[];

  @OneToMany(() => NftMusicLikeEntity, nftMusicLikeEntity => nftMusicLikeEntity.userEntity)
  nftMusicLikeEntity: NftMusicLikeEntity[];

  @OneToMany(() => NftMusicFavoritesEntity, nftMusicFavoritesEntity => nftMusicFavoritesEntity.userEntity)
  nftMusicFavoritesEntity: NftMusicFavoritesEntity[];

  @OneToMany(() => UserFileEntity, userFileEntity => userFileEntity.userEntity)
  userFileEntity: UserFileEntity[];

}
