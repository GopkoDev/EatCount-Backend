import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TelegramLoginRequest } from './dto/telegram.dto';
import { AuthResponse } from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
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
  @Public()
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
  @Public()
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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - invalid or expired token',
  })
  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }
}
