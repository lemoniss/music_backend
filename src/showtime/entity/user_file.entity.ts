import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { UserEntity } from "./user.entity";
import { FileEntity } from "./file.entity";

@Entity({ name: 'user_file' })
export class UserFileEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userFileEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.userFileEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @Column({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형, PROFILE, BANNER' })
  fileType: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
