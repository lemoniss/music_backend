import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity({ name: 'user_sns' })
export class UserSnsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: 'SNS 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: 'SNS 명' })
  name: string;

  @Column({ type: 'varchar', name: 'sns_handle', length: 2000, comment: 'SNS핸들' })
  snsHandle: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userSnsEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

}
