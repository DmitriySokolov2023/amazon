import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guardds/jwt.guard';

export const Auth = ()=> UseGuards(JwtAuthGuard)