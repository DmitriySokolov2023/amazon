import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getAllCategory(){
    return this.categoryService.findAll()
  }
  @Get(':id')
  getCategory(@Param('id') id:number){
    return this.categoryService.findById(id)
  }
}
