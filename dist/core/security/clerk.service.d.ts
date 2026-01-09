import { ConfigService } from '@nestjs/config';
export declare class ClerkService {
    private configService;
    private clerkClient;
    constructor(configService: ConfigService);
    verifyToken(token: string): Promise<any>;
    getUser(userId: string): Promise<any>;
}
