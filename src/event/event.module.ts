import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventRepository } from "./repository/event.repository";
import { UserModule } from "../user/user.module";
import { EventEntity } from "./entity/event.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      EventEntity,
  ])], //L2eRepository 등록
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
