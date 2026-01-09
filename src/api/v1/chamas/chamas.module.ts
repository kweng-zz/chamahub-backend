import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChamasController } from './chamas.controller';
import { ChamasService } from './chamas.service';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { ClerkService } from '../../../core/security/clerk.service';
import { User } from '../../../infrastructure/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chama, User])],
  controllers: [ChamasController],
  providers: [ChamasService, ClerkService],
  exports: [ChamasService],
})
export class ChamasModule {}