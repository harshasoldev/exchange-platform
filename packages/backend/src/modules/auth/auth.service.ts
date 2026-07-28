import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      if (user) {
        await this.prisma.loginLog.create({
          data: { userId: user.id, ip, userAgent, status: 'failed', failReason: 'wrong_password' },
        });
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');
    if (user.isLocked) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new UnauthorizedException('Account is locked. Try again later.');
      }
      // Auto-unlock
      await this.prisma.user.update({ where: { id: user.id }, data: { isLocked: false, loginAttempts: 0 } });
    }

    // Generate tokens
    const payload = { sub: user.id, role: user.role.slug };
    const token = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = uuid();

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        ip,
        userAgent,
        expiresAt,
      },
    });

    // Reset login attempts on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lastLoginAt: new Date(), lastLoginIp: ip },
    });

    // Log success
    await this.prisma.loginLog.create({
      data: { userId: user.id, ip, userAgent, status: 'success' },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'login',
        entity: 'session',
        ip,
        userAgent,
        newValue: { method: 'password' },
      },
    });

    return {
      token,
      refreshToken,
      expiresAt,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role.slug,
        roleName: user.role.name,
        permissions: user.role.permissions.map(rp => rp.permission.name),
      },
    };
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken, isActive: true, expiresAt: { gt: new Date() } },
      include: { user: { include: { role: true } } },
    });
    if (!session) throw new UnauthorizedException('Invalid or expired refresh token');

    const payload = { sub: session.user.id, role: session.user.role.slug };
    const newToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const newRefreshToken = uuid();

    await this.prisma.session.update({
      where: { id: session.id },
      data: { token: newToken, refreshToken: newRefreshToken, lastActivity: new Date() },
    });

    return { token: newToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, token: string) {
    await this.prisma.session.updateMany({
      where: { userId, token, isActive: true },
      data: { isActive: false },
    });

    await this.prisma.auditLog.create({
      data: { userId, action: 'logout', entity: 'session' },
    });

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
    return { message: 'All sessions terminated' };
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } },
      orderBy: { lastActivity: 'desc' },
      select: { id: true, ip: true, userAgent: true, createdAt: true, lastActivity: true, expiresAt: true },
    });
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });
  }
}
