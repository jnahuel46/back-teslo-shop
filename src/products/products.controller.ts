import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a product (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Product created.' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example: {
        value: {
          title: 'Teslo T-shirt',
          price: 199.99,
          description: 'Limited edition Teslo T-shirt',
          slug: 'teslo-t-shirt',
          stock: 50,
          sizes: ['S', 'M', 'L'],
          gender: 'unisex',
          tags: ['summer', 'new'],
          images: ['example_image_1.jpg', 'example_image_2.jpg'],
        },
      },
    },
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @ApiOperation({ summary: 'List products (admin/user)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of products.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @ApiOperation({ summary: 'Get product by ID (admin/user)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update product (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product updated.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      example: { value: { title: 'Updated Teslo T-shirt', price: 249.99 } },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete product (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
