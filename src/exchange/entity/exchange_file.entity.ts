import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { FileEntity } from "./file.entity";
import { ExchangeEntity } from "./exchange.entity";

@Entity({ name: 'exchange_file' })
export class ExchangeFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ExchangeEntity, exchangeEntity => exchangeEntity.exchangeFileEntity)
  @JoinColumn({name: 'exchange_id'})
  exchangeEntity: ExchangeEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.exchangeFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @Column({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형' })
  fileType: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
