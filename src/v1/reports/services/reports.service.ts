import { Injectable } from '@nestjs/common';
import { GetProductsFilterDto } from '../../products/dtos';
import { IProductGetDetailsResponse } from 'src/v1/products/interfaces';
import { ProductsService } from '../../products/services';
import { WriteStream } from 'fs';
import { ReportCreateProducts } from '../infra';
import { ProductsDetails } from '../types';

@Injectable()
export class ReportsService {
  constructor(private readonly productsService: ProductsService) {}

  async getProductsToReport(filterDto: GetProductsFilterDto): Promise<IProductGetDetailsResponse> {
    return await this.productsService.getProducts(filterDto);
  }

  async createReportProducts(products: IProductGetDetailsResponse): Promise<WriteStream> {
    const productsDetails: ProductsDetails[] = [];

    for (const product of products.rows) {
      const details: ProductsDetails = {
        id: product.id,
        description: product.description,
        price: product.price,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
      productsDetails.push(details);
    }

    const reportProduct = new ReportCreateProducts(productsDetails);
    const writeStream = reportProduct.create();

    return writeStream;
  }
}
