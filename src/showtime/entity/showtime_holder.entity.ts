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

@Entity({ name: 'showtime_holder' })
export class ShowtimeHolderEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeTierEntity, showtimeTierEntity => showtimeTierEntity.showtimeHolderEntity)
  @JoinColumn({name: 'tier_id'})
  showtimeTierEntity: ShowtimeTierEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.showtimeHolderEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @Column({ type: 'char', name: 'is_on_sale', length: 1, comment: '판매여부' })
  isOnSale: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
