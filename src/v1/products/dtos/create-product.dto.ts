import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(5, { message: 'The description must be greater 5 characters' })
  description: string;

  @IsNotEmpty()
  price: number;
}
