import { Chama } from './chama.entity';
export declare class Meeting {
    id: string;
    chamaId: string;
    chama: Chama;
    title: string;
    description: string;
    scheduledAt: Date;
    location: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
