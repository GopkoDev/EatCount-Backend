import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTodayMealsQueryDto {
  @ApiPropertyOptional({
    description: 'User timezone (IANA timezone identifier)',
    example: 'Europe/Kiev',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string = 'UTC';
}
