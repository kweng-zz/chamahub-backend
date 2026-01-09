import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Contribution } from '../../../infrastructure/database/entities/contribution.entity';

@Injectable()
export class MpesaService {
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly passKey: string;
  private readonly shortcode: string;
  private readonly callbackUrl: string;
  private readonly environment: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
  ) {
    // Fix 1-5: Add default values and proper typing
    this.consumerKey = this.configService.get<string>('MPESA_CONSUMER_KEY') || '';
    this.consumerSecret = this.configService.get<string>('MPESA_CONSUMER_SECRET') || '';
    this.passKey = this.configService.get<string>('MPESA_PASSKEY') || '';
    this.shortcode = this.configService.get<string>('MPESA_SHORTCODE') || '174379';
    this.callbackUrl = this.configService.get<string>('MPESA_CALLBACK_URL') || 'http://localhost:3001/api/v1/mpesa/callback';
    this.environment = this.configService.get<string>('MPESA_ENVIRONMENT') || 'sandbox';
  }

  private getBaseUrl(): string {
    return this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
      throw new HttpException('Failed to initialize M-Pesa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async initiateSTKPush(data: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    chamaId: string;
    userId: string;
    contributionDate: string;
  }): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      // Fix 6: Use this.passKey instead of this.passkey
      const password = Buffer.from(`${this.shortcode}${this.passKey}${timestamp}`).toString('base64');

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(data.amount),
        PartyA: data.phoneNumber,
        PartyB: this.shortcode,
        PhoneNumber: data.phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: data.accountReference,
        TransactionDesc: `Contribution to ${data.accountReference}`,
      };

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            // Fix 7: Variable name is accessToken, not access_token
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Fix 8: Cast amount to Decimal type using String
      const contribution = this.contributionRepository.create({
        chamaId: data.chamaId,
        userId: data.userId,
        amount: data.amount, // TypeORM will handle conversion to Decimal
        contributionDate: new Date(data.contributionDate),
        status: 'pending',
      });

      await this.contributionRepository.save(contribution);

      return {
        success: true,
        message: 'STK Push sent successfully',
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        contributionId: contribution.id,
      };
    } catch (error: any) {
      console.error('STK Push failed:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.errorMessage || 'Failed to initiate payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleCallback(callbackData: any): Promise<void> {
    try {
      console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

      const { Body } = callbackData;
      const { stkCallback } = Body;

      if (stkCallback.ResultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata.Item;
        
        const amount = callbackMetadata.find((item: any) => item.Name === 'Amount')?.Value;
        const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const phoneNumber = callbackMetadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

        // Find pending contribution and update status
        const contribution = await this.contributionRepository.findOne({
          where: { 
            status: 'pending',
            amount: amount,
          },
          order: { createdAt: 'DESC' },
        });

        if (contribution) {
          contribution.status = 'paid';
          await this.contributionRepository.save(contribution);
          
          console.log(`Contribution ${contribution.id} marked as paid. Receipt: ${mpesaReceiptNumber}`);
        }
      } else {
        // Payment failed
        console.error('M-Pesa payment failed:', stkCallback.ResultDesc);
      }
    } catch (error) {
      console.error('Error processing M-Pesa callback:', error);
    }
  }

  async queryTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      // Fix 9: Use this.passKey instead of this.passkey
      const password = Buffer.from(`${this.shortcode}${this.passKey}${timestamp}`).toString('base64');

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error('Query status failed:', error.response?.data || error.message);
      throw new HttpException('Failed to query transaction status', HttpStatus.BAD_REQUEST);
    }
  }
}