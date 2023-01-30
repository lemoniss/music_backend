import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ShowtimeEntity } from "./showtime.entity";

@Entity({ name: 'showtime_crew' })
export class ShowtimeCrewEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ShowtimeEntity, showtimeEntity => showtimeEntity.showtimeCrewEntity)
  @JoinColumn({name: 'showtime_id'})
  showtimeEntity: ShowtimeEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.showtimeCrewEntity)
  @JoinColumn({name: 'user_id'})
  userEntity: UserEntity;

  @Column({ type: 'varchar', name: 'crew', length: 50, comment: '제작진' })
  name: string;       // A:아티스트 , P:프로듀서 ..........

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
