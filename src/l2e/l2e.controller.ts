// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post, UseGuards
// } from "@nestjs/common";
// import { L2eService } from "./l2e.service";
// import { AuthGuard } from "../guard/auth.guard";
// import { ApiHeader, ApiOperation } from "@nestjs/swagger";
//
// @ApiHeader({
//   name: 'auth_token',
//   description: 'your auth_token'
// })
// // @UseGuards(AuthGuard)
// @Controller("l2e")
// export class L2eController {
//   constructor(private readonly eventService: L2eService) {}
//
//   /**
//    * Save Event
//    * @param createUserDto
//    */
//   // @ApiOperation({summary: 'Save Event '})
//   // @Post()
//   // saveEvent(@Body() saveEventDto: SaveEventDto) : Promise<number> {
//   //   return this.eventService.saveEvent(saveEventDto);
//   // }
//
//   /**
//    * 유저 Event 조회
//    * @param address
//    */
//   @ApiOperation({summary: '유저 Event 조회'})
//   @Get("/:code/:userId")
//   findByEvent(@Param("code") code: string,
//              @Param("userId") userId: number) : Promise<number> {
//     return this.eventService.findByEvent(code, userId);
//   }
//
//
// }
