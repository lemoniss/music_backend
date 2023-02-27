import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { NftMusicEntity } from "./nftmusic.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: 'nft_music_favorites' })
export class NftMusicFavoritesEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => NftMusicEntity, nftMusicEntity => nftMusicEntity.nftMusicFavoritesEntity)
  @JoinColumn({name: 'nft_music_id'})
  nftMusicEntity: NftMusicEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.nftMusicLikeEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
