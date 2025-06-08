"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Typography,
  Divider,
  Empty,
  message,
  Popconfirm,
  Image,
  Space,
  Tag,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import {
  dispatchCartUpdateEvent,
  getCartItems,
  removeFromCart,
} from "@/apiRequests/cart";

const { Title, Text } = Typography;

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

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      message.error("Không thể tải giỏ hàng");
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Nhóm sản phẩm theo shop
  const groupedItems = cartItems.reduce((acc: any, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = {
        shopName: item.shopName,
        shopId: item.shopId,
        items: [],
      };
    }
    acc[item.shopId].items.push(item);
    return acc;
  }, {});

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (cartId: number) => {
    setActionLoading((prev) => ({ ...prev, [cartId]: true }));

    try {
      await removeFromCart(cartId);

      // Cập nhật state local
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartId !== cartId)
      );

      // Dispatch event để cập nhật header
      dispatchCartUpdateEvent();

      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error: any) {
      message.error(error.message || "Không thể xóa sản phẩm");
    } finally {
      setActionLoading((prev) => ({ ...prev, [cartId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">Đang tải giỏ hàng...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Giỏ hàng của bạn đang trống"
          >
            <Button type="primary" onClick={() => (window.location.href = "/")}>
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5]">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4 text-gray-600">Đang tải giỏ hàng...</div>
          </div>
        </div>
      )}

      {/* Empty cart */}
      {!loading && cartItems.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-600">
                  Giỏ hàng của bạn đang trống
                </span>
              }
            >
              <Button
                type="primary"
                size="large"
                className="mt-4 hover:opacity-90 transition-opacity"
                onClick={() => router.push("/")}
              >
                Tiếp tục mua sắm
              </Button>
            </Empty>
          </div>
        </div>
      )}

      {/* Cart content */}
      {!loading && cartItems.length > 0 && (
        <div className="container mx-auto py-5 mt-[110px] px-[160px]">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Title
              level={2}
              className="flex items-center justify-center text-center mb-6"
            >
              <ShoppingCartOutlined className="mr-3 text-primary" />
              Giỏ hàng của bạn ({cartItems.length} sản phẩm)
            </Title>

            <div className="flex flex-col gap-6">
              {Object.values(groupedItems).map((shop: any) => (
                <Card
                  key={shop.shopId}
                  className="border border-gray-200 hover:shadow-md transition-shadow bg-white"
                  title={
                    <div className="flex items-center py-2">
                      <ShopOutlined className="text-primary text-lg mr-2" />
                      <Text strong className="text-lg">
                        {shop.shopName}
                      </Text>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {shop.items.map((item: CartItemResponse, index: number) => (
                      <div key={item.cartId}>
                        <div
                          className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          onClick={() =>
                            router.push(`/products/${item.productId}`)
                          }
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <Image
                              src={item.thumbnail}
                              alt={item.productName}
                              width={100}
                              height={100}
                              className="rounded-lg object-cover"
                              fallback="/images/placeholder.png"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <div>
                                <h3
                                  className="text-lg font-medium mb-2 hover:text-primary transition-colors"
                                  onClick={() =>
                                    router.push(`/products/${item.productId}`)
                                  }
                                >
                                  {item.productName}
                                </h3>
                                {item.variations && (
                                  <Tag color="blue" className="mb-2">
                                    {item.variations}
                                  </Tag>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-primary text-lg font-semibold">
                                  ₫{item.price.toLocaleString("vi-VN")}
                                </div>
                                <Space className="mt-2">
                                  <Popconfirm
                                    title="Xác nhận xóa"
                                    description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                    onConfirm={(e) =>
                                      handleRemoveItem(item.cartId)
                                    }
                                    okText="Xóa"
                                    cancelText="Hủy"
                                  >
                                    <Button
                                      icon={<DeleteOutlined />}
                                      danger
                                      type="link"
                                      loading={actionLoading[item.cartId]}
                                      className="hover:opacity-70"
                                    />
                                  </Popconfirm>
                                </Space>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < shop.items.length - 1 && (
                          <Divider className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
