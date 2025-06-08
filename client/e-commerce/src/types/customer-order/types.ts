export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  VNPAY = "VNPAY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface VariationOptionDTO {
  id: number;
  value: string;
  variationName: string;
}

export interface ProductItemDTO {
  id: number;
  sku: string;
  price: number;
  thumbnail: string;
  productName: string;
}

export interface ProductItemDetailDTO extends ProductItemDTO {
  productDescription: string;
  variationOptions: VariationOptionDTO[];
}

export interface ShopDTO {
  id: number;
  name: string;
  avatar: string;
}

export interface OrderDTO {
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
  productItem: ProductItemDTO;
  shop: ShopDTO;
}

export interface OrderDetailDTO extends Omit<OrderDTO, "productItem"> {
  productItem: ProductItemDetailDTO;
}

export interface OrderListResponseDTO {
  orders: OrderDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
}
