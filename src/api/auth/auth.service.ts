import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isDev } from 'src/common/utils/is-dev';
import { TelegramLoginRequest } from './dto/telegram.dto';
import type { Request, Response } from 'express';
import type { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;
  private readonly COOKIE_NAME = 'refreshToken';
  private readonly TELEGRAM_BOT_TOKEN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.TELEGRAM_BOT_TOKEN =
      this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async loginWithTelegram(res: Response, dto: TelegramLoginRequest) {
    if (!this.isValidTelegramUser(dto)) {
      throw new BadRequestException('Недійсні дані Telegram');
    }

    const telegramId = dto.id.toString();
    const telegramUsername = dto.username || '';
    const photoUrl = dto.photo_url || '';
    const name = dto.first_name
      ? `${dto.first_name} ${dto.last_name || ''}`.trim()
      : '';

    const user = await this.prismaService.user.upsert({
      where: { telegramId },
      update: { name, telegramUsername, photoUrl },
      create: {
        telegramId,
        name,
        telegramUsername,
        photoUrl,
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    const expires = Date.now() + 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(expires),
      },
    });

    this.setCookie(res, refreshToken, new Date(expires));
    return { accessToken };
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshToken = req.cookies?.[this.COOKIE_NAME] as string | undefined;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Відсутній токен оновлення');
    }

    const storedToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      this.setCookie(res, '', new Date(0));
      throw new UnauthorizedException('Недійсний токен оновлення');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.prismaService.refreshToken.delete({
        where: { id: storedToken.id },
      });
      this.setCookie(res, '', new Date(0));
      throw new UnauthorizedException('Токен оновлення закінчився');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!payload || !payload.userId || payload.userId !== storedToken.userId) {
      await this.prismaService.refreshToken.delete({
        where: { id: storedToken.id },
      });
      this.setCookie(res, '', new Date(0));
      throw new UnauthorizedException('Недійсний токен оновлення');
    }

    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(
      storedToken.user.id,
    );
    const expires = Date.now() + 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds

    await this.prismaService.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(expires),
      },
    });

    this.setCookie(res, newRefreshToken, new Date(expires));
    return { accessToken };
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.[this.COOKIE_NAME] as string | undefined;

    this.setCookie(res, '', new Date(0));
    await this.prismaService.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Користувач успішно вийшов з системи' };
  }

  private isValidTelegramUser(dto: TelegramLoginRequest) {
    const { hash, ...data } = dto;

    const authDate = data.auth_date;
    if (authDate) {
      const currentTime = Math.floor(Date.now() / 1000);
      const maxAge = isDev(this.configService) ? 86400 : 60; // 1 day for development, 60 seconds (1 minute) for production

      if (currentTime - authDate > maxAge) {
        return false;
      }
    }

    const filteredData: Record<string, string | number> = {};

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof typeof data];
      if (value !== undefined && value !== null) {
        filteredData[key] = value;
      }
    });

    const sortedKeys = Object.keys(filteredData).sort();

    const dataCheckString = sortedKeys
      .map((key) => `${key}=${filteredData[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHash('sha256')
      .update(this.TELEGRAM_BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return computedHash === hash;
  }

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
