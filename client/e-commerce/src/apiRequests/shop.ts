import http from "@/lib/http";
import { ShopCreationRequest } from "@/types/shop/types";

interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

const shopApiRequest = {
  createShop(request: ShopCreationRequest) {
    const formData = new FormData();
    
    Object.entries(request).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, String(value));
    });

    return http.post<ApiResponse<{ id: number }>>("/shops", formData);
  },
};

export default shopApiRequest; 