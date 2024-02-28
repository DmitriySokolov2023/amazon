import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import { AuthDto } from '../auth/dto/auth.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RefreshDto } from '../auth/dto/refresh.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get(':id')
  findById(@Param('id') id: Prisma.UserWhereUniqueInput) {
    return this.userService.findById(id);
  }

  @Get()
  findAllUsers(){
    return this.userService.findAllUsers()
  }


  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('profile')
  @Auth()
  async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }


  @Auth()
  @HttpCode(200)
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@Param('productId')productId:string, @CurrentUser('id') id: number) {
    return this.userService.toggleFavorite(id, productId);
  }
}
