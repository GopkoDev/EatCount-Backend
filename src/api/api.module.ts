import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [AuthModule, UserModule, MealModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
