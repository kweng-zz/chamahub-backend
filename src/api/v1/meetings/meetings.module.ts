import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting } from '../../../infrastructure/database/entities/meeting.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { ClerkService } from '../../../core/security/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, User, Chama])],
  controllers: [MeetingsController],
  providers: [MeetingsService, ClerkService],
  exports: [MeetingsService],
})
export class MeetingsModule {}