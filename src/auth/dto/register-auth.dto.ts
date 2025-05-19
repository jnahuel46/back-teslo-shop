import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  fullName: string;
}
