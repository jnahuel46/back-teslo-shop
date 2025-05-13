import { IsNumber, IsOptional, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number;
}
