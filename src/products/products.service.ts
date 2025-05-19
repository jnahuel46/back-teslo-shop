import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  //Follow the Repository Pattern
  //The repository is responsible for the data access layer d
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      //create a new instance of the product
      //create the images by using the productImageRepository
      const product = this.productRepository.create({
        ...createProductDto,
        images: createProductDto.images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });
      //save the product
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      return this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //logic to search by title or slug
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne();
    }

    if (!product) {
      this.logger.error(`Product with id ${term} not found`);
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    //preload is used to update the product with the new data
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });
    //create query runner
    //a query runner is a transaction manager
    //a transaction is a set of operations that are executed as a single unit
    //if one of the operations fails, the entire transaction is rolled back
    //if all the operations succeed, the transaction is committed

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        //first delete all the images of the product
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        //then create the new images
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user;
      //update the product
      await queryRunner.manager.save(product);
      //commit the transaction
      await queryRunner.commitTransaction();
      //release the query runner
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.remove(product);
    return 'Product deleted successfully';
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    await query.delete().where({}).execute();
    return 'Products deleted successfully';
  }
}
