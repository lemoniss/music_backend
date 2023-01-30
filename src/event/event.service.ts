import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from "./repository/event.repository";
import { SaveEventDto } from "./dto/save.event.dto";
import { EventEntity } from "./entity/event.entity";

@Injectable()
export class EventService {
  constructor(
    private eventRepository: EventRepository,
  ) {}

  async findByEvent(code: string, userId: number): Promise<number> {
    return await this.eventRepository.findByEvent(code, userId);
  }

  async saveEvent(saveEventDto: SaveEventDto): Promise<number> {
    return await this.eventRepository.saveEvent(saveEventDto);
  }
}
