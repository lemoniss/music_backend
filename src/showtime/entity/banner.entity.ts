import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { BannerFileEntity } from "./banner_file.entity";
import { IsOptional } from "class-validator";
import { BannerLikeEntity } from "./banner_like.entity";

@Entity({ name: 'banner' })
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '배너 식별자'})
  id: number;

  @Column({ type: 'varchar', name: 'lang', length: 50, comment: '최초 디바이스에 정의된 언어' })
  lang: string;

  @Column({ type: 'varchar', name: 'title', length: 100, comment: '제목' })
  title: string;

  @Column({ type: 'varchar', name: 'sub_title', nullable: true, length: 100, comment: '제목' })
  subTitle: string;

  @Column({ type: 'varchar', name: 'contents', length: 4000, comment: '내용' })
  contents: string;

  @Column({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
  viewYn: string;

  @Column({ type: 'int', name: 'order', comment: '순서' })
  order: number;

  @Column({ type: 'varchar', name: 'host', nullable: true, length: 50, comment: '호스트' })
  host: string;

  @Column({ type: 'varchar', name: 'event_at', nullable: true, length: 50, comment: '이벤트일자' })
  eventAt: string;

  @Column({ type: 'varchar', name: 'location', nullable: true, length: 100, comment: '장소' })
  location: string;

  @Column({ type: 'varchar', name: 'btn_text', length: 50, comment: '버튼문구' })
  btnText: string;

  @Column({ type: 'char', name: 'type', nullable: true, length: 1, comment: 'I: 내부링크, O: 외부링크, E: 이벤트, W: whos hot, M: most liked' })
  type: string;

  @Column({ type: 'varchar', name: 'extra', nullable: true, length: 100, comment: '내부파라미터 or 외부링크URL' })
  extra: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at', comment: '수정일' })
  updateAt: Date;

  @OneToMany(() => BannerFileEntity, bannerFileEntity => bannerFileEntity.bannerEntity)
  bannerFileEntity: BannerFileEntity[];

  @OneToMany(() => BannerLikeEntity, bannerLikeEntity => bannerLikeEntity.bannerEntity)
  bannerLikeEntity: BannerLikeEntity[];
}
