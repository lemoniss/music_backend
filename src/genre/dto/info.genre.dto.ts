import { ApiProperty } from "@nestjs/swagger";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class InfoGenreDto {

  @ApiProperty({
    name: 'id',
    description: '장르 식별자',
    required: true,
    example: '1',
  })
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id', comment: '장르식별자'})
  id: number;

  @ApiProperty({
    name: 'name',
    description: '장르명',
    required: true,
    example: 'POP',
  })
  @Column({ type: 'varchar', name: 'name', length: 50, comment: '이름' })
  name: string;
}
