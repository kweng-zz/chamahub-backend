import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ClerkService } from '../../../../core/security/clerk.service';


@Injectable()
export class ClerkAuthGuard implements CanActivate {
    constructor(private clerkService: ClerkService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        //Extract Token
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization format');
        }

        try {
            //Verify token
            const payload = await this.clerkService.verifyToken(token);

            //Attach user info
            request.user = {
                clerkId: payload.sub,
                ...payload,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token')
        }
    }
}