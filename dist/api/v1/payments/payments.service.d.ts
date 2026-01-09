import { Repository } from 'typeorm';
import { Payment } from '../../../infrastructure/database/entities/payment.entity';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private paymentRepository;
    private loanRepository;
    private userRepository;
    constructor(paymentRepository: Repository<Payment>, loanRepository: Repository<Loan>, userRepository: Repository<User>);
    create(createPaymentDto: CreatePaymentDto, clerkId: string): Promise<Payment>;
    findAllByLoan(loanId: string): Promise<Payment[]>;
    findAllByUser(userId: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, clerkId: string): Promise<Payment>;
    remove(id: string, clerkId: string): Promise<void>;
    getTotalByLoan(loanId: string): Promise<number>;
    getRemainingBalance(loanId: string): Promise<number>;
}
