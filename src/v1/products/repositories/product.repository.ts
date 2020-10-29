import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, GetProductsFilterDto } from '../dtos';
import { ProductEntity } from '../entities';
import { IProductGetDetailsResponse } from '../interfaces';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  private logger = new Logger('ProductRepository');

  async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const { description, price } = createProductDto;
    const product = new ProductEntity();
    product.description = description.toUpperCase();
    product.price = price;
    product.deleted = false;

    try {
      await product.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a product. Data: ${JSON.stringify(createProductDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return product;
  }

  async getProducts(filterDto: GetProductsFilterDto): Promise<IProductGetDetailsResponse> {
    const { search, page, limit } = filterDto;
    const query = this.createQueryBuilder('product');

    this.search(search, query);

    this.filterByDeleted(query);

    this.orderBy(query);

    this.pagination(page, limit, query);

    try {
      const products = await query.getManyAndCount();
      const productsDetailsResponse: IProductGetDetailsResponse = {
        rows: products[0],
        count: products[1],
      };
      return productsDetailsResponse;
    } catch (error) {
      this.logger.error(
        `Failed to get product, Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  private search(search: string, query: SelectQueryBuilder<ProductEntity>): void {
    if (search) {
      if (Number(search)) {
        query.andWhere('( product.id = :search )', { search: Number(search) });
      } else {
        query.andWhere('( product.description LIKE :search )', {
          search: `%${search}%`,
        });
      }
    }
  }

  private filterByDeleted(query: SelectQueryBuilder<ProductEntity>): void {
    query.andWhere(`( product.deleted = 'false' )`);
  }

  private orderBy(query: SelectQueryBuilder<ProductEntity>): void {
    query.orderBy('product.id');
  }

  private pagination(page: number, limit: number, query: SelectQueryBuilder<ProductEntity>) {
    if (page && limit) {
      const skippedItems = (page - 1) * limit;
      query.offset(skippedItems);
      query.limit(limit);
    }
  }
}
