import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ExchangeFileEntity } from "./exchange_file.entity";
import { UserExchangeEntity } from "./user_exchange.entity";
import { ExchangeGenreEntity } from "./exchange_genre.entity";
import { NftMusicEntity } from "../../nftmusic/entity/nftmusic.entity";

@Entity({ name: 'exchange' })
export class ExchangeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '거래소 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'ipfs_hash', length: 100, comment: 'IPFS해시' })
  ipfsHash: string;

  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT Token ID' })
  tokenId: string;

  @Column({ type: 'varchar', name: 'item_id', length: 50, comment: '거래소 물품 ID' })
  itemId: string;

  @Column({ type: 'varchar', name: 'price', length: 50, comment: '판매가격' })
  price: string;

  @Column({ type: 'varchar', name: 'minter', length: 50, comment: '최초발행자 지갑주소' })
  minter: string;

  @Column({ type: 'varchar', name: 'seller', length: 50, comment: '판매자 지갑주소' })
  seller: string;

  @Column({ type: 'varchar', name: 'title', length: 50, comment: '제목' })
  title: string;

  @Column({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
  name: string;

  @Column({ type: 'varchar', name: 'artist', length: 50, comment: '아티스트명' })
  artist: string;

  @Index()
  @Column({ type: 'varchar', name: 'handle', length: 50, comment: '핸들' })
  handle: string;

  @Column({ type: 'varchar', name: 'description', length: 4000, comment: '설명' })
  description: string;

  @Column({ type: 'varchar', name: 'lyrics', length: 4000, comment: '가사', nullable: true })
  lyrics: string;

  @Column({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
  playTime: number;

  @Index()
  @Column({ type: 'bigint', name: 'nft_music_id', comment: 'NFT음악식별자' })
  nftMusicId: number;

  @Column({ type: 'varchar', name: 'source', length: 50, comment: '출처' })
  source: string;

  @Column({ type: 'varchar', name: 'tier', length: 50, comment: '티어' })
  tier: string;

  @Column({ type: 'char', name: 'rare_yn', length: 1, comment: 'rare여부' })
  rareYn: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => UserExchangeEntity, userExchangeEntity => userExchangeEntity.exchangeEntity)
  userExchangeEntity: UserExchangeEntity[];

  @OneToMany(() => ExchangeFileEntity, exchangeFileEntity => exchangeFileEntity.exchangeEntity)
  exchangeFileEntity: ExchangeFileEntity[];

  @OneToMany(() => ExchangeGenreEntity, exchangeGenreEntity => exchangeGenreEntity.exchangeEntity)
  exchangeGenreEntity: ExchangeGenreEntity[];

}
