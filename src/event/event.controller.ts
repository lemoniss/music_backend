import {
  Body,
  Controller,
  Get,
  Param,
  Post, UseGuards
} from "@nestjs/common";
import { EventService } from "./event.service";
import { AuthGuard } from "../guard/auth.guard";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import { SaveEventDto } from "./dto/save.event.dto";

@ApiHeader({
  name: 'auth_token',
  description: 'your auth_token'
})
// @UseGuards(AuthGuard)
@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Save Event
   * @param createUserDto
   */
  @ApiOperation({summary: 'Save Event '})
  @Post()
  saveEvent(@Body() saveEventDto: SaveEventDto) : Promise<number> {
    return this.eventService.saveEvent(saveEventDto);
  }

  /**
   * 유저 Event 조회
   * @param address
   */
  @ApiOperation({summary: '유저 Event 조회'})
  @Get("/:code/:userId")
  findByEvent(@Param("code") code: string,
             @Param("userId") userId: number) : Promise<number> {
    return this.eventService.findByEvent(code, userId);
  }


}
