import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    create(createLoanDto: CreateLoanDto, req: any): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan>;
    findAllByChama(chamaId: string): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan[]>;
    findAllByUser(userId: string): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan[]>;
    getTotalByChama(chamaId: string): Promise<number>;
    getActiveByUserInChama(userId: string, chamaId: string): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan[]>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan>;
    update(id: string, updateLoanDto: UpdateLoanDto, req: any): Promise<import("../../../infrastructure/database/entities/loan.entity").Loan>;
    remove(id: string, req: any): Promise<void>;
}
