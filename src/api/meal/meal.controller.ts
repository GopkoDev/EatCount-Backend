import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { MealService } from './meal.service';
import { GetTodayMealsQueryDto } from './dto/get-meals-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MealResponse } from './dto/meal-response.dto';

@ApiTags('Meals')
@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({
    summary: 'Get today meals',
    description: 'Retrieve today user meals based on user timezone',
  })
  @ApiOkResponse({
    description: 'Today meals successfully retrieved',
    type: MealResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - invalid or expired token',
  })
  @ApiQuery({
    name: 'timezone',
    required: false,
    description: 'User timezone (IANA timezone identifier)',
    example: 'Europe/Kiev',
  })
  @ApiBearerAuth()
  @Get('/today')
  @HttpCode(HttpStatus.OK)
  async getTodayMeals(
    @CurrentUser() user: User,
    @Query() query: GetTodayMealsQueryDto,
  ) {
    return await this.mealService.getTodayMeals(user.id, query);
  }
}
