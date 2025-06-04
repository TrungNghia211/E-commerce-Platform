import http from "@/lib/http";

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

const orderApiRequest = {
  createOrder: (orderRequest: CreateOrderRequest) =>
    http.post<any>("/payment/create-order", orderRequest),
};

export default orderApiRequest;
