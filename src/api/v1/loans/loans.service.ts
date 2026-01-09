import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chama)
    private chamaRepository: Repository<Chama>,
  ) {}

  async create(createLoanDto: CreateLoanDto, clerkId: string): Promise<Loan> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: createLoanDto.chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }

    // Check if user has pending loans
    const pendingLoan = await this.loanRepository.findOne({
      where: {
        userId: createLoanDto.userId,
        chamaId: createLoanDto.chamaId,
        status: 'pending',
      },
    });

    if (pendingLoan) {
      throw new BadRequestException('User already has a pending loan in this chama');
    }

    const loan = this.loanRepository.create(createLoanDto);
    return this.loanRepository.save(loan);
  }

  async findAllByChama(chamaId: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { chamaId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUser(userId: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { userId },
      relations: ['chama'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['user', 'chama'],
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto, clerkId: string): Promise<Loan> {
    const loan = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: loan.chamaId },
    });

    // Only chama creator can update loans (approve/reject)
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can update loans');
    }

    Object.assign(loan, updateLoanDto);
    return this.loanRepository.save(loan);
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const loan = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: loan.chamaId },
    });

    // Only chama creator can delete loans
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can delete loans');
    }

    await this.loanRepository.remove(loan);
  }

  // Get total loans for a chama
  async getTotalByChama(chamaId: string): Promise<number> {
    const result = await this.loanRepository
      .createQueryBuilder('loan')
      .select('SUM(loan.amount)', 'total')
      .where('loan.chamaId = :chamaId', { chamaId })
      .andWhere('loan.status = :status', { status: 'approved' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  // Get active loans by user in a chama
  async getActiveByUserInChama(userId: string, chamaId: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: {
        userId,
        chamaId,
        status: 'approved',
      },
      relations: ['chama'],
    });
  }
}