import { IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class UpdatePaymentDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;
}