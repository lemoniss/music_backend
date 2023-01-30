import { ApiProperty } from "@nestjs/swagger";

export class ResponseInfoUserDto {

  @ApiProperty({
    name: 'userId',
    description: '유저 식별자',
    required: true,
    example: '1',
  })
  userId: number;

  @ApiProperty({
    name: 'address',
    description: '지갑주소',
    required: true,
    example: '0x1234....',
  })
  address: string; // 지갑주소

  pk: string;
}
