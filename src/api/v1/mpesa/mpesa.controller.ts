import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { StkPushDto } from './dto/stk-push.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Post('stk-push')
  @UseGuards(ClerkAuthGuard)
  async initiateSTKPush(@Body() stkPushDto: StkPushDto) {
    return this.mpesaService.initiateSTKPush(stkPushDto);
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() callbackData: any) {
    await this.mpesaService.handleCallback(callbackData);
    return { ResultCode: 0, ResultDesc: 'Success' };
  }

  @Post('query-status')
  @UseGuards(ClerkAuthGuard)
  async queryStatus(@Body() body: { checkoutRequestId: string }) {
    return this.mpesaService.queryTransactionStatus(body.checkoutRequestId);
  }
}