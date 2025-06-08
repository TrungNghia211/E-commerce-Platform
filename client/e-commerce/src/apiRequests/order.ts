import http from "@/lib/http";
import { OrderStatus } from "@/types/customer-order/types";
import {
  ApiResponse,
  OrderResponseDto,
  PageResponse,
} from "@/types/seller-order/types";

interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  productItemId: number;
  quantity: number;
  totalPrice: number;
}

interface GetOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  status?: OrderStatus;
}

export interface OrderDetailResponse {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: "COD" | "VNPAY";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  productItem: {
    id: number;
    sku: string;
    quantityInStock: number;
    price: number;
    thumbnail: string;
    product: {
      id: number;
      name: string;
      slug: string;
      thumbnail: string;
      description: string;
      category: {
        id: number;
        name: string;
        slug: string;
      };
    };
    variationOptions: Array<{
      id: number;
      value: string;
      variation: {
        id: number;
        name: string;
      };
    }>;
  };
  customer: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
}

const orderApiRequest = {
  createOrder: (orderRequest: CreateOrderRequest) =>
    http.post<any>("/payment/create-order", orderRequest),

  getOrders: (params: GetOrdersParams) =>
    http.get<ApiResponse<PageResponse<OrderResponseDto>>>("/seller/orders", {
      params: {
        page: params.page,
        size: params.size,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
        search: params.search,
        status: params.status,
      },
    }),

  getOrderDetail: (orderId: number) =>
    http.get<ApiResponse<OrderDetailResponse>>(`/seller/orders/${orderId}`),

  updateOrderStatus: (orderId: number, data: { status: OrderStatus }) =>
    http.put<ApiResponse<OrderDetailResponse>>(
      `/seller/orders/${orderId}/status`,
      data
    ),

  getStatistics: () =>
    http.get<
      ApiResponse<{
        totalOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        totalRevenue: number;
      }>
    >("/seller/orders/statistics"),
};

export default orderApiRequest;
