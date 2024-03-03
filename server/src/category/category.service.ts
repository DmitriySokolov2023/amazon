import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './category.dto';
import { getSlug } from '../utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {
  }
  async findAll() {
    return this.prisma.category.findMany({
      select:returnCategoryObject
    });
  }
  async findById(id: number, selectObject: Prisma.UserSelect = {}) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: +id,
      },
      select: returnCategoryObject,
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async findBySlug(slug:string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
      select: returnCategoryObject,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  async createCategory() {
    return this.prisma.category.create({
      data:{
        name:'',
        slug:''
      }
    })
  }
  async updateCategory(id: string, dto: CategoryDto) {
    return this.prisma.category.update({
      where: {
        id: +id,
      },
      data: {
        name: dto.name,
        slug:getSlug(dto.name),
      },
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: {
        id: +id,
      },
    });
  }
}
