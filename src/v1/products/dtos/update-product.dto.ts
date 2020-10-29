import { MinLength, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @MinLength(5, { message: 'The description must be greater 5 characters' })
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
