import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@Controller('payments')
@UseGuards(ClerkAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user.clerkId);
  }

  @Get('loan/:loanId')
  findAllByLoan(@Param('loanId') loanId: string) {
    return this.paymentsService.findAllByLoan(loanId);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.paymentsService.findAllByUser(userId);
  }

  @Get('total/loan/:loanId')
  getTotalByLoan(@Param('loanId') loanId: string) {
    return this.paymentsService.getTotalByLoan(loanId);
  }

  @Get('balance/loan/:loanId')
  getRemainingBalance(@Param('loanId') loanId: string) {
    return this.paymentsService.getRemainingBalance(loanId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req,
  ) {
    return this.paymentsService.update(id, updatePaymentDto, req.user.clerkId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.paymentsService.remove(id, req.user.clerkId);
  }
}