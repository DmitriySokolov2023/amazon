import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ReviewDto } from './review.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('avg/:id')
  avg(@Param('id') id:string){
    return this.reviewService.getAverageByProductId(id)
  }
  @Get()
  findAll(){
    return this.reviewService.findAll()
  }

  @Get(':id')
  @Auth()
  findById(@Param('id') id:string){
    return this.reviewService.findById(id)
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('create/:productId')
  @Auth()
  async create(@CurrentUser('id') id:number, @Param('productId') productId:string, @Body() dto:ReviewDto){
    return this.reviewService.createReview(id, +productId, dto)
  }
}
