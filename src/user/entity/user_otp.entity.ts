import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity({ name: 'user_otp' })
export class UserOtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: 'OTP 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'secret', length: 50, comment: 'secret' })
  secret: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userOtpEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

}
