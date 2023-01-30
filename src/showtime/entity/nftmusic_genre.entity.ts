import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn, Column
} from "typeorm";
import { NftMusicEntity } from "./nftmusic.entity";
import { GenreEntity } from "./genre.entity";

@Entity({ name: 'nft_music_genre' })
export class NftMusicGenreEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id: number;

  @ManyToOne(() => NftMusicEntity, nftMusicEntity => nftMusicEntity.nftMusicFileEntity)
  @JoinColumn({name: 'nft_music_id'})
  nftMusicEntity: NftMusicEntity;

  @ManyToOne(() => GenreEntity, genreEntity => genreEntity.nftMusicGenreEntity)
  @JoinColumn({name: 'genre_id'})
  genreEntity: GenreEntity;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
