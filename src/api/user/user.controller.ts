import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserResponse } from './dto/user-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get profile of the currently authenticated user',
  })
  @ApiOkResponse({
    type: UserResponse,
    description: 'User profile successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - invalid or expired token',
  })
  @ApiBearerAuth()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponse> {
    return await this.userService.getCurrentUser(user.id);
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get public user profile by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @ApiOkResponse({
    type: UserResponse,
    description: 'User profile successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - invalid or expired token',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBearerAuth()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.getUserById(id);
  }
}
