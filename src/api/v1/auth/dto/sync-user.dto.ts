import { IsString, IsEmail, IsOptional } from 'class-validator';

export class SyncUserDto {
  @IsString()
  clerkId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}