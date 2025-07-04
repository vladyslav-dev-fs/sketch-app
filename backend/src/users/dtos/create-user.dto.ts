import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'A valid and unique email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    description: 'Password must be at least 6 characters long',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    example: 'Marco',
    description: 'Optional display name of the user',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
