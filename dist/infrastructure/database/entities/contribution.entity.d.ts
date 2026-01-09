import { Chama } from './chama.entity';
import { User } from './user.entity';
export declare class Contribution {
    id: string;
    chamaId: string;
    chama: Chama;
    userId: string;
    user: User;
    amount: number;
    contributionDate: Date;
    status: string;
    createdAt: Date;
}
