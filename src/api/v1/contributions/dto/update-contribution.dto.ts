import { IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class UpdateContributionDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  contributionDate?: string;

  @IsString()
  @IsOptional()
  status?: string;
}