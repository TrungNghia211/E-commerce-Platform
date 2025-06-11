export interface HomepageProductResponse {
  id: number;
  name: string;
  price: number;
  thumbnail?: string;
  buyTurn?: number;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  result: T;
  message?: string;
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  price: number;
  thumbnail?: string;
  buyTurn?: number;
  description?: string;
  quantityInStock: number;
  categoryName?: string;
  shop?: {
    id: number;
    name: string;
    avatar?: string;
  };
  productItems?: Array<{
    id: number;
    sku: string;
    price: number;
    quantityInStock: number;
    thumbnail?: string;
    variationOptions?: Array<{
      id: number;
      value: string;
      variationName: string;
    }>;
  }>;
  variations?: Array<{
    id: number;
    name: string;
    options: Array<{
      id: number;
      value: string;
    }>;
  }>;
}
