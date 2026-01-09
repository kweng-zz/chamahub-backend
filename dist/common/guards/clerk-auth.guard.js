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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClerkAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
let ClerkAuthGuard = class ClerkAuthGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const token = authHeader.substring(7);
        try {
            const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://concrete-pheasant-9.clerk.accounts.dev';
            const verifiedToken = await clerk_sdk_node_1.clerkClient.verifyToken(token, {
                secretKey: this.configService.get('CLERK_SECRET_KEY'),
                issuer: frontendUrl,
            });
            if (!verifiedToken) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            request.user = {
                clerkId: verifiedToken.sub,
                sessionId: verifiedToken.sid,
            };
            return true;
        }
        catch (error) {
            console.error('Token verification failed:', error);
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.ClerkAuthGuard = ClerkAuthGuard;
exports.ClerkAuthGuard = ClerkAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ClerkAuthGuard);
//# sourceMappingURL=clerk-auth.guard.js.map