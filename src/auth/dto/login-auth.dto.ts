import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
