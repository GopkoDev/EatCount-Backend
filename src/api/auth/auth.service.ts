import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramLoginRequest } from './dto/telegram.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isDev } from 'src/common/utils/is-dev';
import type { Request, Response } from 'express';
import type { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;
  private readonly COOKIE_NAME = 'refreshToken';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async loginWithTelegram(res: Response, dto: TelegramLoginRequest) {
    const user = await this.prismaService.user.findFirst({
      where: {
        telegramId: dto.id.toString(),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Користувач не знайдений');
    }

    return this.auth(res, user.id);
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshToken = req.cookies?.[this.COOKIE_NAME] as string | undefined;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Відсутній токен оновлення');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Відсутній токен оновлення');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    return this.auth(res, user.id);
  }

  logout(res: Response) {
    this.setCookie(res, '', new Date(0));
    return { message: 'Logout successful' };
  }

  async validateUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    return user;
  }

  private auth = (res: Response, userId: string) => {
    const { accessToken, refreshToken } = this.generateTokens(userId);
    const expires = Date.now() + 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds

    this.setCookie(res, refreshToken, new Date(expires));

    return { accessToken };
  };

  private generateTokens(userId: string) {
    const payload: JwtPayload = { userId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie(this.COOKIE_NAME, value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
      expires,
    });
  }
}
