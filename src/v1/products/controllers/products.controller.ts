import {
  Controller,
  UseGuards,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto, GetProductsFilterDto, UpdateProductDto } from '../dtos';
import { ProductEntity } from '../entities';
import { IProductGetDetailsResponse } from '../interfaces';
import { ProductsService } from '../services';
import { GetUser } from '../../auth/decorators';
import { UserEntity } from '../../auth/entities';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  private logger = new Logger('ProductsController');

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: UserEntity,
  ): Promise<ProductEntity> {
    this.logger.verbose(
      `User "${user.username}" creating a new product. Data: ${JSON.stringify(createProductDto)}`,
    );
    return await this.productsService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(
    @Query(ValidationPipe) filterDto: GetProductsFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<IProductGetDetailsResponse> {
    this.logger.verbose(
      `User "${user.username}" retrieving all products. ${JSON.stringify(filterDto)}`,
    );
    return await this.productsService.getProducts(filterDto);
  }

  @Get('/:id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<ProductEntity> {
    this.logger.verbose(`User "${user.username}" retrieving product with id: ${id}`);
    return await this.productsService.getProductById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" update employee with id: ${id}. Data: ${JSON.stringify(
        updateProductDto,
      )}`,
    );
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    this.logger.verbose(`User "${user.username}" delete product with id: ${id}`);
    return await this.productsService.deleteLogicallyProduct(id);
  }
}
