import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Auth()
  async getProductById( id:number){
    return this.productService.getProductById(id)
  }
}
