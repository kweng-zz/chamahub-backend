import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<import("../../../infrastructure/database/entities/payment.entity").Payment>;
    findAllByLoan(loanId: string): Promise<import("../../../infrastructure/database/entities/payment.entity").Payment[]>;
    findAllByUser(userId: string): Promise<import("../../../infrastructure/database/entities/payment.entity").Payment[]>;
    getTotalByLoan(loanId: string): Promise<number>;
    getRemainingBalance(loanId: string): Promise<number>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/payment.entity").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, req: any): Promise<import("../../../infrastructure/database/entities/payment.entity").Payment>;
    remove(id: string, req: any): Promise<void>;
}
