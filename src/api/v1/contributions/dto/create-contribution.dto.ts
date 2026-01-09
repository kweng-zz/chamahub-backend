import { IsUUID, IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class CreateContributionDto {
  @IsUUID()
  chamaId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  contributionDate: string;

  @IsString()
  @IsOptional()
  status?: string;
}