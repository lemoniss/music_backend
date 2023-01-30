import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string; // 원본파일명

  @IsString()
  @IsNotEmpty()
  url: string; // 파일 저장소 URL

  @IsString()
  @IsNotEmpty()
  ext: string; // 파일 유형

  @IsString()
  @IsNotEmpty()
  key: string; // S3 key

  @IsOptional()
  playTime: number; // playtime
}
