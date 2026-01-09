import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Contribution } from '../../../infrastructure/database/entities/contribution.entity';
export declare class MpesaService {
    private configService;
    private contributionRepository;
    private readonly consumerKey;
    private readonly consumerSecret;
    private readonly passKey;
    private readonly shortcode;
    private readonly callbackUrl;
    private readonly environment;
    constructor(configService: ConfigService, contributionRepository: Repository<Contribution>);
    private getBaseUrl;
    getAccessToken(): Promise<string>;
    initiateSTKPush(data: {
        phoneNumber: string;
        amount: number;
        accountReference: string;
        chamaId: string;
        userId: string;
        contributionDate: string;
    }): Promise<any>;
    handleCallback(callbackData: any): Promise<void>;
    queryTransactionStatus(checkoutRequestId: string): Promise<any>;
}
