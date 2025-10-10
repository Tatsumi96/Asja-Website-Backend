import type { ProductEntity } from '../../product/domain/Entitie/Product';

export interface FilterAndSortProductsParams {
  products: ProductEntity[];
  category: string;
  searchTerm: string;
}
