import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';
import { UserDto } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  getProfile(id:number){
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  updateProfile(id:number, dto:UserDto){

  }
  toggleFavorite(id:number, productId:string){

  }
  findAllUsers(){
    return this.prisma.user.findMany()
  }
  findByEmail(email: string) {

    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  findById(id: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
  }

  async createUser(dto:AuthDto){
    return this.prisma.user.create({
      data:{
        email:dto.email,
        name:faker.person.firstName(),
        avatarPath:faker.image.avatar(),
        phone:faker.string.numeric('+7 (###) ###-##-##'),
        password:await hash(dto.password)
      }
    })
  }
}
