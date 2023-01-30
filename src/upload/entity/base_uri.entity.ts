import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: 'base_uri' })
export class BaseUriEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '파일식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'uri', length: 100, comment: 'baseUri' })
  uri: string;

  @Column({ type: 'varchar', name: 'token_id', length: 50, comment: 'NFT Token ID' })
  tokenId: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;
}
