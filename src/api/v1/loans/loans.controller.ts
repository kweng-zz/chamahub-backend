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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@Controller('loans')
@UseGuards(ClerkAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto, @Request() req) {
    return this.loansService.create(createLoanDto, req.user.clerkId);
  }

  @Get('chama/:chamaId')
  findAllByChama(@Param('chamaId') chamaId: string) {
    return this.loansService.findAllByChama(chamaId);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.loansService.findAllByUser(userId);
  }

  @Get('total/chama/:chamaId')
  getTotalByChama(@Param('chamaId') chamaId: string) {
    return this.loansService.getTotalByChama(chamaId);
  }

  @Get('active/user/:userId/chama/:chamaId')
  getActiveByUserInChama(
    @Param('userId') userId: string,
    @Param('chamaId') chamaId: string,
  ) {
    return this.loansService.getActiveByUserInChama(userId, chamaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @Request() req,
  ) {
    return this.loansService.update(id, updateLoanDto, req.user.clerkId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.loansService.remove(id, req.user.clerkId);
  }
}