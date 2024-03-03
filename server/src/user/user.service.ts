import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';
import { UserDto } from './dto/user.dto';
import { returnUserObject } from './return-user.object';
import { NotFoundError } from 'rxjs';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  findById(id: number, selectObject:Prisma.UserSelect = {}) {
    const user =  this.prisma.user.findUnique({
      where: {
        id: +id,
      },
      select:{
        ...returnUserObject,
        favorites:{
          select:{
            id:true,
            name:true,
            price:true,
            images:true,
            slug:true
          }
        },
        ...selectObject
      }
    });
    if(!user){
      throw new Error('User not found')
    }
    return user
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


  async updateProfile(id:number, dto:UserDto){
    const isSameUser =  await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (isSameUser && id !== isSameUser.id){
      throw new BadRequestException('Email занят')
    }
    const user = await this.findById(id)

    return this.prisma.user.update({
      where:{
        id:id
      },
      data:{
        email:dto.email,
        name:dto.name,
        avatarPath:dto.avatarPath,
        phone:dto.phone,
        password:dto.password ? await  hash(dto.password):user.password
      }
    })
  }
  async toggleFavorite(id:number, productId:string){
    const user = await this.findById(id)

    if(!user) throw  new NotFoundException('User not found')

    const isExists = user.favorites.some(product => product.id === +productId)

    await this.prisma.user.update({
      where:{
        id:user.id
      },
      data:{
        favorites:{
          [isExists ? 'disconnect' : 'connect']:{
            id:+productId
          }
        }
      }
    })
    return 'Success'
  }

  findByEmail(email: string) {

    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }


}
