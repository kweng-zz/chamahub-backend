import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../../infrastructure/database/entities/payment.entity';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, clerkId: string): Promise<Payment> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const loan = await this.loanRepository.findOne({
      where: { id: createPaymentDto.loanId },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // Check if loan is approved
    if (loan.status !== 'approved') {
      throw new BadRequestException('Can only make payments on approved loans');
    }

    // Check if user is the loan borrower
    if (loan.userId !== createPaymentDto.userId) {
      throw new ForbiddenException('You can only make payments on your own loans');
    }

    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAllByLoan(loanId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { loanId },
      relations: ['user'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findAllByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['loan'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'loan'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, clerkId: string): Promise<Payment> {
    const payment = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only the user who made the payment can update it
    if (payment.userId !== user.id) {
      throw new ForbiddenException('You can only update your own payments');
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const payment = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const loan = await this.loanRepository.findOne({
      where: { id: payment.loanId },
      relations: ['chama'],
    });

    // Only chama creator or payment maker can delete
    if (loan?.chama?.createdById !== user.id && payment.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own payments or if you are the chama creator');
    }

    await this.paymentRepository.remove(payment);
  }

  // Get total payments for a loan
  async getTotalByLoan(loanId: string): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.loanId = :loanId', { loanId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  // Get remaining balance for a loan
  async getRemainingBalance(loanId: string): Promise<number> {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    const totalPaid = await this.getTotalByLoan(loanId);
    const totalOwed = parseFloat(loan.amount.toString()) * (1 + parseFloat(loan.interestRate.toString()) / 100);
    
    return totalOwed - totalPaid;
  }
}