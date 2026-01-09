import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Req, 
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @UseGuards(ClerkAuthGuard)
  async syncUser(@Body() userData: any) {
    return this.authService.syncUser(userData);
  }

  // PUT SEARCH BEFORE ME
  @Get('search')
  @UseGuards(ClerkAuthGuard)
  async searchUser(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email parameter is required');
    }
    
    const user = await this.authService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@Req() req) {
    return this.authService.findByClerkId(req.user.clerkId);
  }
}