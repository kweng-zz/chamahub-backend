import { MpesaService } from './mpesa.service';
import { StkPushDto } from './dto/stk-push.dto';
export declare class MpesaController {
    private readonly mpesaService;
    constructor(mpesaService: MpesaService);
    initiateSTKPush(stkPushDto: StkPushDto): Promise<any>;
    handleCallback(callbackData: any): Promise<{
        ResultCode: number;
        ResultDesc: string;
    }>;
    queryStatus(body: {
        checkoutRequestId: string;
    }): Promise<any>;
}
