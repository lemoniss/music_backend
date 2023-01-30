// import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
// import { ApiProperty } from "@nestjs/swagger";
//
// export class SortDashboardDto {
//
//   @ApiProperty({
//     name: 'search',
//     description: '검색 키워드; 필수 아님',
//     required: true,
//     example: '밀림',
//   })
//   @IsString()
//   @IsOptional()
//   search: string;  // 내음원식별자
//
//   @ApiProperty({
//     name: 'sortType',
//     description: '정렬 유형',
//     required: true,
//     example: '인기순: play_count, 최신순: create_at, 좋아요 순: likes(추가 예정)',
//   })
//   @IsString()
//   @IsNotEmpty()
//   sortType: string;
//
//   @ApiProperty({
//     name: 'limitNumber',
//     description: '몇 개를 보여줄 것인지',
//     required: true,
//     example: '5',
//   })
//   @IsNumber()
//   @IsNotEmpty()
//   limitNumber: number;
// }
