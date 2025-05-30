import http from "@/lib/http";
import type {
  ProductCreationRequest,
  ProductResponse,
  Page,
  ApiResponse,
} from "@/types/product";

interface ProductResponse {
  id: string;
  name: string;
  // Add other fields you expect in the ProductResponse DTO from backend
  slug: string;
  thumbnail?: string;
  price?: number;
  quantityInStock?: number;
  // Add variations, productItems structure if needed for display
}

// Assuming a Page type structure like this (adjust if yours is different)
interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number (0-indexed by default in Spring, but frontend might use 1-indexed)
  size: number;
  // other pagination properties
}

const productApiRequest = {
  getHomepageProducts: (pageNumber: number) =>
    http.get<any>(`/products?pageNumber=${pageNumber}&pageSize=3`),

  createProduct: (formData: FormData) =>
    http.post<ProductResponse>("/products", formData),

  // Update the return type to ApiResponse<Page<ProductResponse>>
  getSellerProducts: (pageNumber: number, pageSize: number) =>
    http.get<ApiResponse<Page<ProductResponse>>>(
      `/products/seller?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  // createProduct: () => {}
};

export default productApiRequest;
