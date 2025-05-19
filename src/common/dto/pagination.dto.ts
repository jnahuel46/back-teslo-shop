import { IsNumber, IsOptional, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    example: 0,
    description: 'Number of items to skip',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number;
}
