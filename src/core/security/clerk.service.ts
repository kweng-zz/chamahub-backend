import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
    private clerkClient;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('clerk.secretKey');
        this.clerkClient = createClerkClient({secretKey});
    }

    async verifyToken(token: string) {
        try {
            //Verify JWT Token
            const verified = await this.clerkClient.verifyToken(token);
            return verified;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async getUser(userId: string) {
        try {
            const user = await this.clerkClient.users.getUser(userId);
            return user;
        } catch (error) {
            throw new UnauthorizedException('User not found');
        }
    }
}