import { IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class UpdateLoanDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  interestRate?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  status?: string;
}