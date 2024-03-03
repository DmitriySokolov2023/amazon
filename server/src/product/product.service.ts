import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma:PrismaService) {}

  async getProductById(id:number){
    const product = await this.prisma.product.findUnique({
      where:{
        id
      }
    })

    if(!product){
      throw new NotFoundException('Product not found')
    }
    return product
  }
}
