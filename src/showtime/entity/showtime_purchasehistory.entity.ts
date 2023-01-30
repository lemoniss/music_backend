import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ShowtimeTierEntity } from "./showtime_tier.entity";

@Entity({ name: 'showtime_purchase_history' })
export class ShowtimePurchaseHistoryEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeTierEntity, showtimeTierEntity => showtimeTierEntity.showtimePurchaseHistoryEntity)
  @JoinColumn({name: 'tier_id'})
  showtimeTierEntity: ShowtimeTierEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.showtimePurchaseHistoryEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @Column({ type: 'varchar', name: 'symbol', length: 50, comment: 'symbol', nullable: true })
  symbol: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
