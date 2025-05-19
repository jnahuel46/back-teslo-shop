import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData, SeedUser } from './data/seed';
import { Product } from 'src/products/entities/product.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  async executeSeed() {
    //first delete all the products
    await this.productsService.deleteAllProducts();
    //then delete all the users
    await this.deleteTables();
    //then insert the users
    const adminUser = await this.insertUsers();
    //then insert the products
    //call the initial data
    const products = initialData.products;
    //empty array to store the promises
    const insertPromises = [];
    //for each product, we create a promise and push it to the array
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, adminUser));
    });
    //the empty array is filled with the promises and then we await for all the promises to be resolved
    await Promise.all(insertPromises);
    return 'Seed executed successfully';
  }
}
