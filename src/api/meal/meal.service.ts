import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetTodayMealsQueryDto } from './dto/get-meals-query.dto';
import { MealResponse } from './dto/meal-response.dto';
import { DateTime } from 'luxon';

@Injectable()
export class MealService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayMeals(
    userId: string,
    query: GetTodayMealsQueryDto,
  ): Promise<MealResponse[]> {
    const { timezone = 'UTC' } = query;

    const todayRange = this.getTodayRange(timezone);

    const whereClause = {
      userId,
      timestamp: {
        gte: todayRange.start,
        lte: todayRange.end,
      },
    };

    const meals = await this.prisma.meal.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: [{ timestamp: 'desc' }],
    });

    return meals;
  }

  private getTodayRange(timezone: string): { start: Date; end: Date } {
    try {
      const today = DateTime.now().setZone(timezone);
      const startOfDay = today.startOf('day');
      const endOfDay = today.endOf('day');

      return {
        start: startOfDay.toJSDate(),
        end: endOfDay.toJSDate(),
      };
    } catch {
      const now = new Date();
      const start = new Date(now);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setUTCHours(23, 59, 59, 999);

      return { start, end };
    }
  }
}
