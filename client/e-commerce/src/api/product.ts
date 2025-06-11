import { http } from "@/lib/http";
import { ApiResponse } from "@/types/api";
import {
  ProductCreationRequest,
  ProductDetailResponse,
  ProductResponse,
} from "@/types/product";

export const productApiRequest = {
  createProduct: (formData: FormData) =>
    http.post<ProductResponse>("/products", formData),

  getSellerProducts: (params: { page: number; size: number }) =>
    http.get<ApiResponse<ProductResponse[]>>("/products/seller", { params }),

  updateProduct: (productId: number, formData: FormData) =>
    http.put<ProductResponse>(`/products/${productId}`, formData),

  deleteProduct: (productId: number) =>
    http.delete<void>(`/products/${productId}`),

  getSellerProductDetail: (productId: number) =>
    http.get<ApiResponse<ProductDetailResponse>>(
      `/products/seller/${productId}`
    ),
};
