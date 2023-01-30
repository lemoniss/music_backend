import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { FileEntity } from "./file.entity";
import { BannerEntity } from "./banner.entity";

@Entity({ name: 'banner_file' })
export class BannerFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => BannerEntity, bannerEntity => bannerEntity.bannerFileEntity)
  @JoinColumn({name: 'banner_id'})
  bannerEntity: BannerEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.bannerFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
