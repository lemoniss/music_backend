import {
  Body,
  Controller,
  Get,
  Param,
  Post, UseGuards
} from "@nestjs/common";
import { BlockchainService } from "./blockchain.service";
import { AuthGuard } from "../guard/auth.guard";
import { ApproveDto } from "./dto/approve.dto";
import { SetBaseUriDto } from "./dto/set.baseuri.dto";

@UseGuards(AuthGuard)
@Controller("/blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}


  // @Get("/getWeb3Test")
  // getWeb3Test()
  //   : Promise<any> {
  //   return this.blockchainService.getWeb3Test();
  // }

  @Post('/setBaseUri')
  setBaseUri(@Body() setBaseUriDto: SetBaseUriDto): Promise<any> {
    return this.blockchainService.setBaseUri(setBaseUriDto);
  }

  @Post('/showtimeApprove')
  showtimeApprove(@Body() approveDto: ApproveDto): Promise<any> {
    return this.blockchainService.showtimeApprove(approveDto);
  }
}
