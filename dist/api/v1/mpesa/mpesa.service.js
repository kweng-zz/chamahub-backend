"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const contribution_entity_1 = require("../../../infrastructure/database/entities/contribution.entity");
let MpesaService = class MpesaService {
    configService;
    contributionRepository;
    consumerKey;
    consumerSecret;
    passKey;
    shortcode;
    callbackUrl;
    environment;
    constructor(configService, contributionRepository) {
        this.configService = configService;
        this.contributionRepository = contributionRepository;
        this.consumerKey = this.configService.get('MPESA_CONSUMER_KEY') || '';
        this.consumerSecret = this.configService.get('MPESA_CONSUMER_SECRET') || '';
        this.passKey = this.configService.get('MPESA_PASSKEY') || '';
        this.shortcode = this.configService.get('MPESA_SHORTCODE') || '174379';
        this.callbackUrl = this.configService.get('MPESA_CALLBACK_URL') || 'http://localhost:3001/api/v1/mpesa/callback';
        this.environment = this.configService.get('MPESA_ENVIRONMENT') || 'sandbox';
    }
    getBaseUrl() {
        return this.environment === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }
    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            const response = await axios_1.default.get(`${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to initialize M-Pesa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async initiateSTKPush(data) {
        try {
            const accessToken = await this.getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
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
            const response = await axios_1.default.post(`${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`, requestBody, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const contribution = this.contributionRepository.create({
                chamaId: data.chamaId,
                userId: data.userId,
                amount: data.amount,
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
        }
        catch (error) {
            console.error('STK Push failed:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.errorMessage || 'Failed to initiate payment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleCallback(callbackData) {
        try {
            console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));
            const { Body } = callbackData;
            const { stkCallback } = Body;
            if (stkCallback.ResultCode === 0) {
                const callbackMetadata = stkCallback.CallbackMetadata.Item;
                const amount = callbackMetadata.find((item) => item.Name === 'Amount')?.Value;
                const mpesaReceiptNumber = callbackMetadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;
                const phoneNumber = callbackMetadata.find((item) => item.Name === 'PhoneNumber')?.Value;
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
            }
            else {
                console.error('M-Pesa payment failed:', stkCallback.ResultDesc);
            }
        }
        catch (error) {
            console.error('Error processing M-Pesa callback:', error);
        }
    }
    async queryTransactionStatus(checkoutRequestId) {
        try {
            const accessToken = await this.getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
            const password = Buffer.from(`${this.shortcode}${this.passKey}${timestamp}`).toString('base64');
            const response = await axios_1.default.post(`${this.getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
                BusinessShortCode: this.shortcode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Query status failed:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to query transaction status', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.MpesaService = MpesaService;
exports.MpesaService = MpesaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(contribution_entity_1.Contribution)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], MpesaService);
//# sourceMappingURL=mpesa.service.js.map