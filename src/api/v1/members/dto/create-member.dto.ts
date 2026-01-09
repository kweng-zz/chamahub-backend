import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsUUID()
  chamaId: string;

  @IsUUID()
  userId: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  status?: string;
}