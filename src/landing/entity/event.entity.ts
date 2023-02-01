import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: 'event' })
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: 'Event 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'code', length: 50, comment: '이벤트코드'})
  code: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '이벤트명' })
  name: string;

  @Column({ type: 'varchar', name: 'status', length: 50, comment: '상태' })
  status: string;

  @Column({ type: 'int', name: 'sequence', comment: '번호', nullable: true })
  sequence: number;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.eventEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;
}
