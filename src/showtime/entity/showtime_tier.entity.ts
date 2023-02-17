import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column, OneToMany
} from "typeorm";
import { ShowtimeEntity } from "./showtime.entity";
import { ShowtimePurchaseHistoryEntity } from "./showtime_purchasehistory.entity";
import { ShowtimeFileEntity } from "./showtime_file.entity";
import { ShowtimeHolderEntity } from "./showtime_holder.entity";

@Entity({ name: 'showtime_tier' })
export class ShowtimeTierEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.showtimeTierEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @OneToMany(() => ShowtimePurchaseHistoryEntity, showtimePurchaseHistoryEntity => showtimePurchaseHistoryEntity.showtimeTierEntity)
  showtimePurchaseHistoryEntity: ShowtimePurchaseHistoryEntity[];

  @OneToMany(() => ShowtimeHolderEntity, showtimeHolderEntity => showtimeHolderEntity.showtimeTierEntity)
  showtimeHolderEntity: ShowtimeHolderEntity[];

  @OneToMany(() => ShowtimeFileEntity, showtimeFileEntity => showtimeFileEntity.showtimeTierEntity)
  showtimeFileEntity: ShowtimeFileEntity[];

  @Column({ type: 'varchar', name: 'tier', length: 20, comment: '티어유형' })
  tier: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
  name: string;

  @Column({ type: 'int', name: 'song_no', comment: '노래 번호' })
  songNo: number;

  @Column({ type: 'char', name: 'purchase_yn', length: 1, comment: '구매여부' })
  purchaseYn: string;

  @Column({ type: 'varchar', name: 'ipfs_hash', length: 100, comment: 'IPFS해시', nullable: true })
  ipfsHash: string;

  @Column({ type: 'varchar', name: 'price', length: 50, comment: '판매가격' })
  price: string;

  @Column({ type: 'char', name: 'rare_yn', length: 1, comment: 'rare여부' })
  rareYn: string;

  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT Token ID' })
  tokenId: string;

  @Column({ type: 'varchar', name: 'description', length: 4000, comment: '설명' })
  description: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
