import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { FileEntity } from "./file.entity";
import { ShowtimeTierEntity } from "./showtime_tier.entity";

@Entity({ name: 'showtime_file' })
export class ShowtimeFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeTierEntity, showtimeTierEntity => showtimeTierEntity.showtimeFileEntity)
  @JoinColumn({name: 'showtime_tier_id'})
  showtimeTierEntity: ShowtimeTierEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.showtimeFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @Column({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형' })
  fileType: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
