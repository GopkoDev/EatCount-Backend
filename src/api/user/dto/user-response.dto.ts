import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  @ApiProperty({ description: 'Unique user identifier' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'User name', required: false })
  @Expose()
  name?: string;

  @ApiProperty({ description: 'User photo URL', required: false })
  @Expose()
  photoUrl?: string;

  @ApiProperty({ description: 'Verification date', required: false })
  @Expose()
  verified?: Date;

  @ApiProperty({ description: 'Two-factor authentication enabled' })
  @Expose()
  twoFactorEnabled: boolean;

  @ApiProperty({ description: 'Telegram username', required: false })
  @Expose()
  telegramUsername?: string;

  @ApiProperty({ description: 'User language code', required: false })
  @Expose()
  languageCode?: string;

  @ApiProperty({ description: 'Account creation date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @Expose()
  updatedAt: Date;

  // Sensitive fields excluded from response
  @Exclude()
  twoFactorSecret?: string;

  @Exclude()
  telegramId?: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
