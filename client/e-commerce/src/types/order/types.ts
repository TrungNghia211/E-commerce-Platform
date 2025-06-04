export interface CheckoutItem {
  productItemId: number;
  productName: string;
  thumbnail: string;
  variations: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  productItemId: number;
  quantity: number;
  totalPrice: number;
}
