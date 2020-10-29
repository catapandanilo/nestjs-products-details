import { Controller, Get, Logger, Query, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from '../services';
import { GetUser } from '../../auth/decorators';
import { UserEntity } from '../../auth/entities';
import { GetProductsFilterDto } from '../../products/dtos';
import { Response } from 'express';
import { WriteStream, unlinkSync } from 'fs';
import { IProductGetDetailsResponse } from 'src/v1/products/interfaces';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  private logger = new Logger('ReportsController');

  constructor(private readonly reportService: ReportsService) {}

  @Get('/products')
  async getReportProducts(
    @Query(ValidationPipe) filterDto: GetProductsFilterDto,
    @GetUser() user: UserEntity,
    @Res() response: Response,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" retrieving report of products using filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    try {
      const products: IProductGetDetailsResponse = await this.reportService.getProductsToReport(
        filterDto,
      );

      if (products.count === 0) {
        response.sendStatus(204);
      } else {
        const writeStream: WriteStream = await this.reportService.createReportProducts(products);
        this.writeStream(writeStream, response);
      }
    } catch (err) {
      console.error('ERROR: ' + err.message);
    }
  }

  private writeStream(writeStream: WriteStream, response: Response<any>) {
    writeStream.addListener('finish', function sendPDF() {
      const dir = writeStream.path.toString();
      response.download(dir);
      setTimeout(function deletePDF() {
        if (process.env.NODE_ENV === 'production') {
          unlinkSync(dir);
        }
      }, 2000);
    });
  }
}
