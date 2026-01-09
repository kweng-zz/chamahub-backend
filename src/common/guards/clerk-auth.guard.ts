import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Get the frontend URL for issuer
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://concrete-pheasant-9.clerk.accounts.dev';
      
      const verifiedToken = await clerkClient.verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
        issuer: frontendUrl,
      });
      
      if (!verifiedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user info to request
      request.user = {
        clerkId: verifiedToken.sub,
        sessionId: verifiedToken.sid,
      };

      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}