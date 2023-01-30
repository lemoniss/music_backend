import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { MyMusicGenreEntity } from "./mymusic_genre.entity";

@Entity({ name: 'genre' })
export class GenreEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '장르식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '이름' })
  name: string;

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
  viewYn: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => MyMusicGenreEntity, myMusicGenreEntity => myMusicGenreEntity.genreEntity)
  myMusicGenreEntity: MyMusicGenreEntity[];
}
