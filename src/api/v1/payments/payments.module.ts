import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from '../../../infrastructure/database/entities/payment.entity';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { ClerkService } from '../../../core/security/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Loan, User])],
  controllers: [PaymentsController],
  providers: [PaymentsService, ClerkService],
  exports: [PaymentsService],
})
export class PaymentsModule {}