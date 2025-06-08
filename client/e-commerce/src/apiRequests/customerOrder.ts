import http from "@/lib/http";
import {
  OrderDetailDTO,
  OrderListResponseDTO,
  OrderStatus,
} from "@/types/customer-order/types";

export const orderService = {
  // Get customer orders with pagination and filtering
  getCustomerOrders: async (
    page: number = 0,
    size: number = 10,
    status?: OrderStatus
  ): Promise<OrderListResponseDTO> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) params.append("status", status);

    const response = await http.get<any>(`/customer/orders?${params}`);
    return response.payload;
  },

  // Get order detail by ID
  getOrderDetail: async (orderId: number): Promise<OrderDetailDTO> => {
    const response = await http.get<any>(`/customer/orders/${orderId}`);
    return response.payload;
  },
};
