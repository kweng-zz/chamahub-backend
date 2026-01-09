import { Loan } from './loan.entity';
import { User } from './user.entity';
export declare class Payment {
    id: string;
    loanId: string;
    loan: Loan;
    userId: string;
    user: User;
    amount: number;
    paymentDate: Date;
    createdAt: Date;
}
