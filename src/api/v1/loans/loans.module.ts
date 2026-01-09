import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { ClerkService } from '../../../core/security/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, User, Chama])],
  controllers: [LoansController],
  providers: [LoansService, ClerkService],
  exports: [LoansService],
})
export class LoansModule {}