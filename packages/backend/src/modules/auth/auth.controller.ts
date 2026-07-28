import { Controller, Post, Get, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: Record<string, string>, @Req() req: any) {
    return this.authService.login(body.username, body.password, req.ip, req.headers['user-agent']);
  }

  @Post('refresh')
  async refresh(@Body() body: Record<string, string>) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(req.user.id, token);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const { passwordHash, twoFactorSecret, ...user } = req.user;
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role?.slug,
      roleName: user.role?.name,
      permissions: user.role?.permissions?.map((rp: any) => rp.permission.name) || [],
      balance: user.balance,
      exposureLimit: user.exposureLimit,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Req() req: any) {
    return this.authService.getSessions(req.user.id);
  }

  @Get('admin/check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async adminCheck() {
    return { status: 'ok', message: 'Super Admin access confirmed' };
  }
}
