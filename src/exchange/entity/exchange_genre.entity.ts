import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { ExchangeEntity } from "./exchange.entity";
import { GenreEntity } from "./genre.entity";

@Entity({ name: 'exchange_genre' })
export class ExchangeGenreEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => ExchangeEntity, exchangeEntity => exchangeEntity.exchangeFileEntity)
  @JoinColumn({name: 'exchange_id'})
  exchangeEntity: ExchangeEntity;

  @ManyToOne(() => GenreEntity, genreEntity => genreEntity.exchangeGenreEntity)
  @JoinColumn({name: 'genre_id'})
  genreEntity: GenreEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
