import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ClerkService } from '../../../../core/security/clerk.service';
export declare class ClerkAuthGuard implements CanActivate {
    private clerkService;
    constructor(clerkService: ClerkService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
