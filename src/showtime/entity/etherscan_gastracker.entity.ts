import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: 'etherscan_gastracker' })
export class EtherscanGastrackerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'safe_gas_price', length: 50, comment: '저' })
  safeGasPrice: string;

  @Column({ type: 'varchar', name: 'propose_gas_price', length: 50, comment: '중' })
  proposeGasPrice: string;

  @Column({ type: 'varchar', name: 'fast_gas_price', length: 50, comment: '고' })
  fastGasPrice: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
