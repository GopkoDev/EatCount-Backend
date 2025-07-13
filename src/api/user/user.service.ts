import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(id: string) {
    // Used in JwtStrategy to validate user
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    return user;
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        targets: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    const userResponse = plainToClass(UserResponse, user, {
      excludeExtraneousValues: true,
    });

    const calorieTarget = user.targets ? user.targets.calorieTarget : null;
    return { ...userResponse, calorieTarget };
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        targets: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    const userResponse = plainToClass(UserResponse, user, {
      excludeExtraneousValues: true,
    });

    const calorieTarget = user.targets ? user.targets.calorieTarget : null;
    return { ...userResponse, calorieTarget };
  }
}
