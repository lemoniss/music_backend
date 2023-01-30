import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { FileEntity } from "./file.entity";
import { NftMusicEntity } from "./nftmusic.entity";

@Entity({ name: 'nft_music_file' })
export class NftMusicFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => NftMusicEntity, nftMusicEntity => nftMusicEntity.nftMusicFileEntity)
  @JoinColumn({name: 'nft_music_id'})
  nftMusicEntity: NftMusicEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.nftMusicFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @Column({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형' })
  fileType: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
