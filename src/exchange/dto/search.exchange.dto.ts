import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchExchangeDto {

  @ApiProperty({
    name: 'keyword',
    description: '검색어',
    required: false,
    example: '홍길동',
  })
  @IsOptional()
  keyword: string; // 이미지파일URL


  @ApiProperty({
    name: 'genreIds',
    description: '장르ID Array',
    required: false,
    example: '1,2,3,4',
  })
  @IsOptional()
  genreIds: number[];  // 장르ID

  @IsOptional()
  authToken: string;
}
