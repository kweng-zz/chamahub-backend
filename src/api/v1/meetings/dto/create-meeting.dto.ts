import { IsUUID, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateMeetingDto {
  @IsUUID()
  chamaId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  status?: string;
}