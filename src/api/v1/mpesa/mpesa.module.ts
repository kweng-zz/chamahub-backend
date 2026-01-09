import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';
import { Contribution } from '../../../infrastructure/database/entities/contribution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
  controllers: [MpesaController],
  providers: [MpesaService],
  exports: [MpesaService],
})
export class MpesaModule {}