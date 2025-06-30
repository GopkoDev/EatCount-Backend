import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { TelegramLoginRequest } from './dto/telegram.dto';
import { AuthResponse } from './dto/auth.dto';
import { Authorization } from '../../common/decorators/authorization.decorator';
import { Authorizate } from '../../common/decorators/authorizate.decorator';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login or registration with Telegram',
    description:
      'Authenticate or create user using Telegram login credentials.',
  })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'Successfully logged in or registered with Telegram.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - invalid Telegram login data.',
  })
  @Post('/telegram')
  @HttpCode(HttpStatus.OK)
  async loginWithTelegram(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: TelegramLoginRequest,
  ) {
    return await this.authService.loginWithTelegram(res, dto);
  }

  @ApiOperation({
    summary: 'Refresh authentication tokens',
    description:
      'Refresh access and refresh tokens using the refresh token stored in cookies.',
  })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'Successfully refreshed tokens',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - invalid or expired refresh token.',
  })
  @ApiNotFoundResponse({
    description: 'Not Found - user not found.',
  })
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refreshTokens(req, res);
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Clear the refresh token cookie to log out the user.',
  })
  @ApiOkResponse({
    description: 'Successfully logged out',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully logged out',
        },
      },
    },
  })
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Authorization()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  getMe(@Authorizate() user: User) {
    return user;
  }
}
