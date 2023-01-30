import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: 'l2e' })
export class L2eEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: 'l2e 식별자'})
  id: number;

  @Index()
  @Column({ type: 'bigint', name: 'user_id', comment: 'user 식별자' })
  userId: number;

  @Index()
  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT tokenId' })
  tokenId: string;

  @Column({ type: 'bigint', name: 'total_second', comment: '노래 들은 총시간' })
  totalSecond: number;

  @Column({ type: 'varchar', name: 'source', length: 50, comment: '노래 출처', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
