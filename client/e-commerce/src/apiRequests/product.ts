import http from "@/lib/http";
import type { ProductResponse, Page, ApiResponse } from "@/types/product";
import { HomepageProductResponse } from "@/types/product";

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

  getProductDetail: (productId: number) =>
    http.get<any>(`/products/${productId}`),

  updateProduct: (productId: number, formData: FormData) =>
    http.put<ProductResponse>(`/products/${productId}`, formData),

  deleteProduct: (productId: number) =>
    http.delete<void>(`/products/${productId}`),

  updateProductStatus: (productId: number, active: boolean) =>
    http.put<ProductResponse>(`/products/${productId}/status?active=${active}`),

  getSellerProductDetail: (productId: number) =>
    http.get<ApiResponse<ProductDetailResponse>>(
      `/products/seller/${productId}`
    ),

  searchProducts: (
    keyword: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ) =>
    http.get<ApiResponse<Page<HomepageProductResponse>>>("/products/search", {
      params: { keyword, pageNumber, pageSize },
    }),
};

export default productApiRequest;
