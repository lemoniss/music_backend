import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { NftMusicEntity } from "./nftmusic.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: 'nft_history' })
export class NftHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '이력 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'tx_hash', length: 100, comment: '트랜잭션해시' })
  txHash: string;

  @Column({ type: 'varchar', name: 'status', length: 10, comment: '상태 > SUCCESS / FAILED ' })
  status: string;

  @Column({ type: 'varchar', name: 'block_number', length: 50, comment: 'from Address' })
  blockNumber: string;

  @Index()
  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT tokenId' })
  tokenId: string;

  @Index()
  @Column({ type: 'varchar', name: 'from_address', length: 50, comment: 'from Address' })
  fromAddress: string;

  @Index()
  @Column({ type: 'varchar', name: 'to_address', length: 50, comment: 'to Address' })
  toAddress: string;

  @Column({ type: 'varchar', name: 'symbol', length: 10, comment: '코인 심볼' })
  symbol: string;

  @Column({ type: 'varchar', name: 'price', length: 50, comment: '가격' })
  price: string;

  @Column({ type: 'varchar', name: 'method', length: 50, comment: '분류 (ex: mint, regist, cancel, buy, sw_mint, sw_buy, gift)' })
  method: string;

  @Column({ type: 'varchar', name: 'extra', length: 1000, comment: '비고', nullable: true})
  extra: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
