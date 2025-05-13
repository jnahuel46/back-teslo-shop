import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async executeSeed() {
    //first delete all the products
    await this.productsService.deleteAllProducts();
    //call the initial data
    const products = initialData.products;
    //empty array to store the promises
    const insertPromises = [];
    //for each product, we create a promise and push it to the array
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });
    //the empty array is filled with the promises and then we await for all the promises to be resolved
    await Promise.all(insertPromises);  
    return 'Seed executed successfully';
  }
}
