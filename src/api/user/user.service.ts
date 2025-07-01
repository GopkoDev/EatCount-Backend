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
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    // Use class-transformer for safe data return
    return plainToClass(UserResponse, user, { excludeExtraneousValues: true });
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    return plainToClass(UserResponse, user, { excludeExtraneousValues: true });
  }
}
