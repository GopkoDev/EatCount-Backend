import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class TelegramLoginRequest {
  @ApiProperty({
    description: 'Unique telegram identifier for the user',
    example: 123456789,
  })
  @IsNumber()
  @Min(0)
  id: number;

  @ApiProperty({
    description: 'User authentication date in Unix timestamp format',
    example: 1633036800,
  })
  @IsNumber()
  auth_date: number;

  @ApiProperty({
    description: 'Telegram username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user (optional)',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiProperty({
    description: 'URL to user profile photo (optional)',
    example: 'https://t.me/i/userpic/320/example.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  photo_url: string;

  @ApiProperty({
    description: 'Hash for verifying the authenticity of the data',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  @IsString()
  hash!: string;
}
