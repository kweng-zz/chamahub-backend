import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { ClerkService } from '../../../core/security/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, ClerkService],
  exports: [AuthService, ClerkService],
})
export class AuthModule {}