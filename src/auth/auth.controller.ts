import { Controller, Post, Body, Request } from '@nestjs/common';

import { AuthService, accessAndRefreshTokens } from './auth.service';
import { User } from '../database/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() userData: Partial<User>) {
    return this.authService.login(userData);
  }

  @Post('refresh')
  async refreshTokens(@Request() req): Promise<accessAndRefreshTokens> {
    return this.authService.refreshTokens(req.user);
  }
}
