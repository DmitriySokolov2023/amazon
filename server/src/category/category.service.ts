import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { returnCategoryObject } from './return-category.object';

@Injectable()
export class CategoryService {
  constructor(private prisma:PrismaService) {}
  findById(id: number, selectObject:Prisma.UserSelect = {}) {
    const category =  this.prisma.category.findUnique({
      where: {
        id: +id,
      },
      select:returnCategoryObject
    });
    if(!category){
      throw new Error('Category not found')
    }
    return category
  }

  findAll (){
    return this.prisma.category.findMany()
  }
}
