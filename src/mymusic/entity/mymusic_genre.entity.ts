import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { MyMusicEntity } from "./mymusic.entity";
import { GenreEntity } from "./genre.entity";

@Entity({ name: 'my_music_genre' })
export class MyMusicGenreEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => MyMusicEntity, myMusicEntity => myMusicEntity.myMusicGenreEntity)
  @JoinColumn({name: 'my_music_id'})
  myMusicEntity: MyMusicEntity;

  @ManyToOne(() => GenreEntity, genreEntity => genreEntity.myMusicGenreEntity)
  @JoinColumn({name: 'genre_id'})
  genreEntity: GenreEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
