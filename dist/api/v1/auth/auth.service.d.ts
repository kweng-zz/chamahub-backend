import { Repository } from 'typeorm';
import { User } from '../../../infrastructure/database/entities/user.entity';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    syncUser(userData: any): Promise<User>;
    findByClerkId(clerkId: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
