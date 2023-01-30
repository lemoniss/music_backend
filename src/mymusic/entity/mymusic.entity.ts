import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { MyMusicGenreEntity } from "./mymusic_genre.entity";
import { MyMusicFileEntity } from "./mymusic_file.entity";
import { UserEntity } from "../../user/entity/user.entity";

@Entity({ name: 'my_music' })
export class MyMusicEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '내가만든음원 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 50, comment: '제목' })
  title: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
  name: string;

  @Column({ type: 'varchar', name: 'artist', length: 50, comment: '아티스트명' })
  artist: string;

  @Column({ type: 'varchar', name: 'description', length: 4000, comment: '설명' })
  description: string;

  @Column({ type: 'varchar', name: 'lyrics', length: 4000, comment: '가사', nullable: true })
  lyrics: string;

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
  viewYn: string;

  @Column({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
  playTime: number;

  @Index()
  @Column({ type: 'varchar', name: 'handle', length: 50, comment: '핸들' })
  handle: string;

  @Column({ type: 'varchar', name: 'status', length: 50, comment: '상태 (검수중(Review), 승인(Approved), 반려(Rejected))' })
  status: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userFileEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @OneToMany(() => MyMusicGenreEntity, myMusicGenreEntity => myMusicGenreEntity.myMusicEntity)
  myMusicGenreEntity: MyMusicGenreEntity[];

  @OneToMany(() => MyMusicFileEntity, myMusicFileEntity => myMusicFileEntity.myMusicEntity)
  myMusicFileEntity: MyMusicFileEntity[];
}
