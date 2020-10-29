import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
