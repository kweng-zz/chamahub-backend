import { User } from './user.entity';
export declare class Chama {
    id: string;
    name: string;
    description: string;
    contributionAmount: number;
    contributionFrequency: string;
    memberCount: number;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
