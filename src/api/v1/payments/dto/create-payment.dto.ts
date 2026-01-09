import { IsUUID, IsNumber, IsDateString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  loanId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  paymentDate: string;
}