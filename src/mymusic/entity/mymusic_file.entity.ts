import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { MyMusicEntity } from "./mymusic.entity";
import { FileEntity } from "./file.entity";

@Entity({ name: 'my_music_file' })
export class MyMusicFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => MyMusicEntity, myMusicEntity => myMusicEntity.myMusicFileEntity)
  @JoinColumn({name: 'my_music_id'})
  myMusicEntity: MyMusicEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.myMusicFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @Column({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형' })
  fileType: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
