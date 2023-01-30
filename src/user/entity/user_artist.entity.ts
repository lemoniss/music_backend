import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity({ name: 'user_artist' })
export class UserArtistEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: 'Artist 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'role', length: 50, comment: '역할' })
  role: string;

  @Column({ type: 'varchar', name: 'is_comingsoon', length: 1, comment: 'YN' })
  isComingsoon: string;

  @Column({ type: 'bigint', name: 'order', comment: '아티스트노출순서' })
  order: number;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userArtistEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

}
