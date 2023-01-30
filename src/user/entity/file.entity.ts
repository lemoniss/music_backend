
/*
@Entity - 해당 클래스는 DB user 테이블과 매핑시킬 때 사용
@Unique - 유니크 컬럼을 설정할 때 사용(배열 형태로 원하는 컬럼 값을 지정하면 된다)
@PrimaryGeneratedColumn - uuid 값을 지정하면 해당 컬럼은 uuid 타입으로 설정이 되며, Auto Increment 타입으로 설정
Auto_Increment : @PrimaryGeneratedColumn()
UUID: @PrimaryGeneratedColumn('uuid')
@Column - 해당 클래스 속성과 DB user 테이블 컬럼과 매핑시킬 때 사용
@CreateDateColumn - 데이터가 생성되는 시간을 기록할 때 사용
@UpdateDateColumn - 데이터가 수정되는 시간을 기록할 때 사용
*/

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
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

  @OneToMany(() => UserFileEntity, userFileEntity => userFileEntity.fileEntity)
  userFileEntity: UserFileEntity[];

}
