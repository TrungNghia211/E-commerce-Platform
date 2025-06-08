import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/customer-order/types";

export interface OrderResponseDto {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  productItem: {
    id: number;
    sku: string;
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
    variationOptions: {
      id: number;
      value: string;
      variation: {
        id: number;
        name: string;
      };
    }[];
  };
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}
