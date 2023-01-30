import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { UserEntity } from "./user.entity";
import { BannerEntity } from "./banner.entity";

@Entity({ name: 'banner_like' })
export class BannerLikeEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => BannerEntity, bannerEntity => bannerEntity.bannerLikeEntity)
  @JoinColumn({name: 'banner_id'})
  bannerEntity: BannerEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.bannerLikeEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
