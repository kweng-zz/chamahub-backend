import { Chama } from './chama.entity';
import { User } from './user.entity';
export declare class Loan {
    id: string;
    chamaId: string;
    chama: Chama;
    userId: string;
    user: User;
    amount: number;
    interestRate: number;
    dueDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
