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

@Entity({ name: 'user_nft_music' })
export class UserNftMusicEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => NftMusicEntity, nftMusicEntity => nftMusicEntity.userNftMusicEntity)
  @JoinColumn({name: 'nft_music_id'})
  nftMusicEntity: NftMusicEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userNftMusicEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
