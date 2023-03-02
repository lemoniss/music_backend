import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: 'user_follower' })
export class UserFollowerEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userFollowerEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @ManyToOne(() => UserEntity, followerEntity => followerEntity.targetFollowerEntity)
  @JoinColumn({name: 'follower_id'})
  followerEntity: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
