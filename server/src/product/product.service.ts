import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { getSlug } from '../utils/generate-slug';
import { returnObjectProductFullest, returnProductObject } from './return-product.object';
import { ProductDto } from './product.dto';
import { faker } from '@faker-js/faker';
import { EnumProductSort, GetAllProductDto } from './get-all.product.dto';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class ProductService {
  constructor(private prisma:PrismaService, private paginationService:PaginationService) {}

  async getAllProduct(dto: GetAllProductDto = {}){
      const {sort, searchTerm} = dto
      const prismaSort:Prisma.ProductOrderByWithRelationInput[] = []

    if (sort === EnumProductSort.LOW_PRICE){
      prismaSort.push({price:'asc'})
    }
    else if (sort === EnumProductSort.HIGH_PRISE){
      prismaSort.push({price:'desc'})
    }
    else if (sort === EnumProductSort.OLDEST){
      prismaSort.push({createdAt:'asc'})
    }
    else prismaSort.push({createdAt:'desc'})

    const prismaSearchTermFilter:Prisma.ProductWhereInput = searchTerm ? {
      OR:[
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        }
      ]
    } : {}

    const {perPage, skip} = this.paginationService.getPagination(dto)

    const products = await this.prisma.product.findMany({
      where:prismaSearchTermFilter,
      orderBy:prismaSort,
      skip,
      take:perPage
    })

    return {
      products,
      length:await this.prisma.product.count({
        where:prismaSearchTermFilter
      })
    }
  }

  async getProductById(id:number){
    const product = await this.prisma.product.findUnique({
      where:{
        id
      },
      select:returnObjectProductFullest
    })

    if(!product){
      throw new NotFoundException('Product not found')
    }
    return product
  }

  async findBySlug(slug:string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: returnObjectProductFullest,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async findByCategorySlag(categorySlug:string) {
    const product = await this.prisma.product.findMany({
      where: {
        category:{
          slug:categorySlug
        }
      },
      select: returnObjectProductFullest,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getSimilar(id:number) {
    const currentProduct = await this.getProductById(id)
    if (!currentProduct) {
      throw new NotFoundException('Current product not found');
    }
    console.log(currentProduct.category.name)
    const product = await this.prisma.product.findMany({
      where: {
        category:{
          name:currentProduct.category.name
        },
        NOT:{
          id:currentProduct.id
        },
      },
      orderBy:{createdAt:'desc'},
      select: returnProductObject,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async createProduct() {
    return this.prisma.product.create({
      data:{
        description:'',
        name:'',
        price:0,
        slug:faker.random.word()
      }
    })
  }
  async updateProduct(id: string, dto: ProductDto) {
    return this.prisma.product.update({
      where: {
        id: +id,
      },
      data: {
        name: dto.name,
        price:dto.price,
        description:dto.description,
        images:['image1','image2','image3'],
        categoryId:dto.categoryId,
        slug:getSlug(dto.name)
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: {
        id: +id,
      },
    });
  }
}
