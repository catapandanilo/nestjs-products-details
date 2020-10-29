import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './v1/auth/auth.module';
import { ProductsModule } from './v1/products/products.module';
import { ReportsModule } from './v1/reports/reports.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, ProductsModule, ReportsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
