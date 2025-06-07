import { clientSessionToken } from "@/lib/http";

interface AddToCartRequest {
  productItemId: number;
  quantity: number;
}

interface ApiResponse<T> {
  code?: number;
  result?: T;
}

interface CartItemResponse {
  cartId: number;
  productItemId: number;
  productId: number;
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

export const addToCart = async (request: AddToCartRequest): Promise<void> => {
  const response = await fetch("http://localhost:8080/ecommerce/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: clientSessionToken.value
        ? `Bearer ${clientSessionToken.value}`
        : "",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Không thể thêm sản phẩm vào giỏ hàng"
    );
  }
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = async (): Promise<CartItemResponse[]> => {
  const response = await fetch("http://localhost:8080/ecommerce/cart", {
    method: "GET",
    headers: {
      Authorization: clientSessionToken.value
        ? `Bearer ${clientSessionToken.value}`
        : "",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể lấy danh sách giỏ hàng");
  }

  const data: ApiResponse<CartItemResponse[]> = await response.json();
  return data.result || [];
};

// Lấy số lượng sản phẩm trong giỏ hàng
export const getCartCount = async (): Promise<number> => {
  try {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartId: number): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/ecommerce/cart/${cartId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: clientSessionToken.value
          ? `Bearer ${clientSessionToken.value}`
          : "",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Không thể xóa sản phẩm khỏi giỏ hàng"
    );
  }
};

// Dispatch custom event để thông báo cart đã được cập nhật
export const dispatchCartUpdateEvent = (): void => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("cartUpdated"));
};
