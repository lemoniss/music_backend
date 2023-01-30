import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ShowtimeEntity } from "./showtime.entity";
import { FileEntity } from "./file.entity";

@Entity({ name: 'showtime_movie' })
export class ShowtimeMovieEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.showtimeMovieEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.showtimeMovieEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @ManyToOne(() => FileEntity, fileEntity => fileEntity.showtimeMovieEntity)
  @JoinColumn({name: 'file_id'})
  fileEntity: FileEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
