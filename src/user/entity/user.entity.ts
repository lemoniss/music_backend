
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
  Entity, Index, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { UserFileEntity } from "./user_file.entity";
import { UserGenreEntity } from "./user_genre.entity";
import { UserSnsEntity } from "./user_sns.entity";
import { UserOtpEntity } from "./user_otp.entity";
import { UserArtistEntity } from "./user_artist.entity";

@Entity({ name: 'user' })
@Unique(['address', 'handle'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '사용자식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'address', length: 50, comment: '지갑주소' })
  address: string;

  @Column({ type: 'varchar', name: 'nickname', length: 50, comment: '닉네임' })
  nickname: string;

  @Column({ type: 'varchar', name: 'handle', length: 50, comment: '핸들' })
  handle: string;

  @Column({ type: 'varchar', name: 'introduce', length: 2000, comment: '내소개글' })
  introduce: string;

  @Column({ type: 'varchar', name: 'lang', length: 50, comment: '최초 디바이스에 정의된 언어' })
  lang: string;

  @Column({ type: 'varchar', name: 'nation', length: 50, comment: '최초 디바이스에 정의된 국적' })
  nation: string;

  @Column({ type: 'varchar', name: 'device', length: 50, comment: '최초 디바이스' })
  device: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => UserFileEntity, userFileEntity => userFileEntity.userEntity)
  userFileEntity: UserFileEntity[];

  @OneToMany(() => UserGenreEntity, userGenreEntity => userGenreEntity.userEntity)
  userGenreEntity: UserGenreEntity[];

  @OneToMany(() => UserSnsEntity, userSnsEntity => userSnsEntity.userEntity)
  userSnsEntity: UserSnsEntity[];

  @OneToMany(() => UserOtpEntity, userOtpEntity => userOtpEntity.userEntity)
  userOtpEntity: UserOtpEntity[];

  @OneToMany(() => UserArtistEntity, userArtistEntity => userArtistEntity.userEntity)
  userArtistEntity: UserArtistEntity[];
}
