import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    syncUser(userData: any): Promise<import("../../../infrastructure/database/entities/user.entity").User>;
    searchUser(email: string): Promise<import("../../../infrastructure/database/entities/user.entity").User>;
    getCurrentUser(req: any): Promise<import("../../../infrastructure/database/entities/user.entity").User>;
}
