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
import { UserEntity } from "./user.entity";

@Entity({ name: 'user_genre' })
export class UserGenreEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => UserEntity, userEntity => userEntity.userGenreEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @ManyToOne(() => GenreEntity, genreEntity => genreEntity.showtimeGenreEntity)
  @JoinColumn({name: 'genre_id'})
  genreEntity: GenreEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
