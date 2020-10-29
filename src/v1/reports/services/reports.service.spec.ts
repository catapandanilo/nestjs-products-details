import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ProductsService } from '../../products/services/products.service';

describe('Reports Service', () => {
  let service: ReportsService;
  let productsService: ProductsService;
  const mockProductsService = () => ({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: ProductsService,
          useFactory: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
