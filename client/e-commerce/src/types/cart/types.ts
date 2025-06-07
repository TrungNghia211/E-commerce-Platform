export interface CartItemResponse {
  cartId: number;
  productItemId: number;
  productName: string;
  thumbnail: string;
  variations: string;
  price: number;
  quantity: number;
  quantityInStock: number;
  shopName: string;
  shopId: number;
  totalPrice: number;
}
