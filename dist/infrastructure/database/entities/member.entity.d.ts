import { User } from './user.entity';
import { Chama } from './chama.entity';
export declare class Member {
    id: string;
    chamaId: string;
    chama: Chama;
    userId: string;
    user: User;
    role: string;
    status: string;
    joinedAt: Date;
    updatedAt: Date;
}
