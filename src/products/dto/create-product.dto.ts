import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Teslo T-shirt', description: 'Unique product name' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 199.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'Limited edition Teslo T-shirt', required: false, description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'teslo-t-shirt', required: false, description: 'Product slug' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 50, required: false, description: 'Product stock' })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: ['S', 'M', 'L'], description: 'Available sizes' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  sizes: string[];

  @ApiProperty({ example: 'unisex', description: 'Product gender' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({ example: ['summer', 'new'], required: false, description: 'Product tags' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: ['example_image_1.jpg', 'example_image_2.jpg'], required: false, description: 'Product images' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];  
}
