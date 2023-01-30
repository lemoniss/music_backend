import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { ShowtimeEntity } from "./showtime.entity";
import { GenreEntity } from "./genre.entity";

@Entity({ name: 'showtime_genre' })
export class ShowtimeGenreEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.showtimeGenreEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @ManyToOne(() => GenreEntity, genreEntity => genreEntity.showtimeGenreEntity)
  @JoinColumn({name: 'genre_id'})
  genreEntity: GenreEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
