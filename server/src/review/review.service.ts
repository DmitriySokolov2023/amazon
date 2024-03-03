import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnCategoryObject } from '../category/return-category.object';
import { Prisma } from '@prisma/client';
import { CategoryDto } from '../category/category.dto';
import { getSlug } from '../utils/generate-slug';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService, private productService:ProductService) {
  }
  async findAll() {
    return this.prisma.review.findMany({
      orderBy:{
        createdAt:'desc'
      },
      select:returnReviewObject
    });
  }
  async findById(id: string, selectObject: Prisma.UserSelect = {}) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: +id,
      },
      select: returnReviewObject,
    });
    if (!review) {
      throw new Error('Reviews not found');
    }
    return review;
  }

  async createReview(userId:number,productId:number, dto:ReviewDto) {
    const isValid = await this.productService.getProductById(productId)

    if(!isValid) throw new NotFoundException('The product does not exist')

    return this.prisma.review.create({
      data:{
        rating:+dto.rating,
        text:dto.text,
        product:{
          connect:{
            id:+productId
          }
        },
        user:{
          connect:{
            id:+userId
          }
        }
      }
    })
  }

  async getAverageByProductId(productId: string) {
    const id = +productId
    return this.prisma.review.aggregate({
      where:{id},
      _avg:{rating:true}
    })
      .then(data => data._avg )
  }
}
