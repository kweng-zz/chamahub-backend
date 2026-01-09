import { Repository } from 'typeorm';
import { Loan } from '../../../infrastructure/database/entities/loan.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
export declare class LoansService {
    private loanRepository;
    private userRepository;
    private chamaRepository;
    constructor(loanRepository: Repository<Loan>, userRepository: Repository<User>, chamaRepository: Repository<Chama>);
    create(createLoanDto: CreateLoanDto, clerkId: string): Promise<Loan>;
    findAllByChama(chamaId: string): Promise<Loan[]>;
    findAllByUser(userId: string): Promise<Loan[]>;
    findOne(id: string): Promise<Loan>;
    update(id: string, updateLoanDto: UpdateLoanDto, clerkId: string): Promise<Loan>;
    remove(id: string, clerkId: string): Promise<void>;
    getTotalByChama(chamaId: string): Promise<number>;
    getActiveByUserInChama(userId: string, chamaId: string): Promise<Loan[]>;
}
