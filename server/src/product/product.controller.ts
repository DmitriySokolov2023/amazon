import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';
import * as stream from 'stream';
import { ProductDto } from './product.dto';
import { GetAllProductDto } from './get-all.product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  @UsePipes(new ValidationPipe())
  @Get()
  async getAllProduct(@Query() queryDto:GetAllProductDto) {
    return this.productService.getAllProduct(queryDto);
  }
  @Get()
  async getProductById(id: number) {
    return this.productService.getProductById(id);
  }

  @Get(':slug')
  async findBySlag(@Param('slug')slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('category/:slug')
  async findByCategorySlag(@Param('slug') slug:string) {
    return this.productService.findByCategorySlag(slug);
  }
  @Get('similar/:productId')
  async getSimilar(@Param('productId') productId: string) {
    return this.productService.getSimilar(+productId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createProduct() {
    return this.productService.createProduct()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':productId')
  @Auth()
  async updateProduct(@Param('productId') productId: string, @Body() dto:ProductDto) {
    return this.productService.updateProduct(productId, dto)
  }

  @Delete(':productId')
  @Auth()
  async deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId)
  }
}
