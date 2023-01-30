import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { UserFileRepository } from "./repository/user_file.repository";
import { UserGenreRepository } from "./repository/user_genre.repository";
import { UserSnsRepository } from "./repository/user_sns.repository";
import { UserOtpRepository } from "./repository/user_otp.repository";
import { UserEntity } from "./entity/user.entity";
import { UserFileEntity } from "./entity/user_file.entity";
import { UserGenreEntity } from "./entity/user_genre.entity";
import { UserSnsEntity } from "./entity/user_sns.entity";
import { UserOtpEntity } from "./entity/user_otp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,
    UserFileEntity,
    UserGenreEntity,
    UserSnsEntity,
    UserOtpEntity,
  ])], //L2eRepository 등록
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserFileRepository,
    UserGenreRepository,
    UserSnsRepository,
    UserOtpRepository,
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
