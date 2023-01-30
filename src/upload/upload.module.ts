import { Module } from '@nestjs/common';
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadRepository } from "./repository/upload.repository";
import { UserModule } from "../user/user.module";
import { BaseUriRepository } from "./repository/baseuri.repository";
import { FileEntity } from "./entity/file.entity";
import { BaseUriEntity } from "./entity/base_uri.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([FileEntity, BaseUriEntity])
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    BaseUriRepository
  ],
  exports: [TypeOrmModule, UploadService],
})
export class UploadModule {}
