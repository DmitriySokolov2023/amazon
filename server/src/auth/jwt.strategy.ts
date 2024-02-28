import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import {ExtractJwt, Strategy} from 'passport-jwt'
import { User } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService:ConfigService,
    private prisma:PrismaService
  ) {
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:true,
      secretOrKey:configService.get('JWT_SECRET')
    });
  }

  async validate({id}:Pick<User, 'id'>): Promise<any> {
    return this.prisma.user.findFirst({
      where:{
        id:+id
      }
    })
  }
}