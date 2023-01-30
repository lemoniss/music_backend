import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column, OneToMany
} from "typeorm";
import { ShowtimeEntity } from "./showtime.entity";
import { FileEntity } from "./file.entity";
import { ShowtimeGenreEntity } from "./showtime_genre.entity";
import { ShowtimePurchaseHistoryEntity } from "./showtime_purchasehistory.entity";
import { ShowtimeFileEntity } from "./showtime_file.entity";

@Entity({ name: 'showtime_distributor' })
export class ShowtimeDistributorEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.showtimeDistributorEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @Column({ type: 'varchar', name: 'address', length: 50, comment: '지갑주소' })
  address: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '분배자 이름' })
  name: string;

  @Column({ type: 'float', name: 'percent', comment: '분배 퍼센트' })
  percent: number;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
