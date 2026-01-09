import { IsUUID, IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  chamaId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  interestRate?: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsOptional()
  status?: string;
}