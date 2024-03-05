import { PaginationDto } from '../pagination/pagination.dto';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumProductSort{
  HIGH_PRISE= 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST='oldest'
}

export class GetAllProductDto extends PaginationDto{
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?:EnumProductSort

  @IsOptional()
  @IsString()
  searchTerm?:string
}