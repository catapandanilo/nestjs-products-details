import { ProductEntity } from '../entities';

export interface IProductGetDetailsResponse {
  rows: ProductEntity[];
  count: number;
}
