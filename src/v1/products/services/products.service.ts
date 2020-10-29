import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, GetProductsFilterDto, UpdateProductDto } from '../dtos';
import { ProductEntity } from '../entities';
import { IProductGetDetailsResponse } from '../interfaces';
import { ProductRepository } from '../repositories';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productRepository.createProduct(createProductDto);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    const found = await this.productRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!found) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return found;
  }

  async getProductDescriptionById(id: number): Promise<string> {
    const found = await this.getProductById(id);
    return found.description;
  }

  async getProducts(filterDto: GetProductsFilterDto): Promise<IProductGetDetailsResponse> {
    return this.productRepository.getProducts(filterDto);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<void> {
    await this.getProductById(id);
    await this.productRepository.update({ id }, { ...updateProductDto });
  }

  async deleteLogicallyProduct(id: number): Promise<void> {
    await this.getProductById(id);
    const deleted = { deleted: true };
    await this.productRepository.update({ id }, { ...deleted });
  }
}
