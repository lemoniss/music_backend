import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { NftMusicFileEntity } from "./nftmusic_file.entity";
import { UserFileEntity } from "./user_file.entity";

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '파일식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '파일명' })
  name: string;

  @Column({ type: 'varchar', name: 'url', length: 100, comment: '파일URL' })
  url: string;

  @Column({ type: 'varchar', name: 'ext', length: 10, comment: '파일유형' })
  ext: string;

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
  viewYn: string;

  @Column({ type: 'varchar', name: 'key', length: 50, comment: 'S3 key' })
  key: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => NftMusicFileEntity, nftMusicFileEntity => nftMusicFileEntity.fileEntity)
  nftMusicFileEntity: NftMusicFileEntity[];

  @OneToMany(() => UserFileEntity, userFileEntity => userFileEntity.fileEntity)
  userFileEntity: UserFileEntity[];
}
