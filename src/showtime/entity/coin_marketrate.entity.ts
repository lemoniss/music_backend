import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: 'coin_marketrate' })
export class CoinMarketRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '코인명' })
  name: string;

  @Column({ type: 'varchar', name: 'rate', length: 100, comment: '시세' })
  rate: string;

  @Column({ type: 'varchar', name: 'currency', length: 10, comment: '화폐' })
  currency: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
