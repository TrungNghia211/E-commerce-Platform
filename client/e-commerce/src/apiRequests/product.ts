import http from "@/lib/http";
import type { ProductResponse, Page, ApiResponse } from "@/types/product";

interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  price?: number;
  quantityInStock?: number;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const productApiRequest = {
  getHomepageProducts: (pageNumber: number) =>
    http.get<any>(`/products?pageNumber=${pageNumber}&pageSize=18`),

  createProduct: (formData: FormData) =>
    http.post<ProductResponse>("/products", formData),

  getSellerProducts: (pageNumber: number, pageSize: number) =>
    http.get<ApiResponse<Page<ProductResponse>>>(
      `/products/seller?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),
};

export default productApiRequest;
