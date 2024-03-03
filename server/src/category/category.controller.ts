import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @Auth()
  getAllCategory(){
    return this.categoryService.findAll()
  }
  @Get(':id')
  @Auth()
  getCategoryById(@Param('id') id:number){
    return this.categoryService.findById(id)
  }
  @Get('by-slug/:slug')
  @Auth()
  getCategoryBySlug(@Param('slug') slug:string){
    return this.categoryService.findBySlug(slug)
  }


  @HttpCode(200)
  @Auth()
  @Post()
  createCategory(){
    return this.categoryService.createCategory()
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  updateCategory(@Param('id') id:string, @Body() dto:CategoryDto){
    return this.categoryService.updateCategory(id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  deleteCategory(@Param('id') id:string){
    return this.categoryService.deleteCategory(id)
  }

}
