import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { ExchangeEntity } from "./exchange.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: 'user_exchange' })
export class UserExchangeEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ExchangeEntity, exchangeEntity => exchangeEntity.userExchangeEntity)
  @JoinColumn({name: 'exchange_id'})
  exchangeEntity: ExchangeEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userExchangeEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
