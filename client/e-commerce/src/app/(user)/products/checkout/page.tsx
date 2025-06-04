"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Divider,
  notification,
  Spin,
} from "antd";
import { ShoppingCartOutlined, CreditCardOutlined } from "@ant-design/icons";

import orderApiRequest from "@/apiRequests/order";
import { CheckoutItem, CreateOrderRequest } from "@/types/order/types";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CheckoutPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        setCheckoutItems(items);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin sản phẩm!",
        });
        router.push("/");
      }
    } else router.push("/");
  }, [searchParams, router]);

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (values: any) => {
    if (checkoutItems.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Không có sản phẩm để thanh toán!",
      });
      return;
    }

    setLoading(true);

    try {
      const firstItem = checkoutItems[0];

      const orderRequest: CreateOrderRequest = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        productItemId: firstItem.productItemId,
        quantity: firstItem.quantity,
        totalPrice: totalAmount,
      };

      const response = await orderApiRequest.createOrder(orderRequest);

      if (response.status === 200) {
        const paymentUrl = response.payload.result;

        if (values.paymentMethod === "VNPAY") window.location.href = paymentUrl;
        else {
          // Thanh toán COD - chuyển về profile
          notification.success({
            message: "Thành công",
            description: "Đặt hàng thành công!",
          });
          router.push("/profile?tab=orders");
        }
      } else throw new Error("Tạo đơn hàng thất bại");
    } catch (error) {
      console.error("Error creating order:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo đơn hàng. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]">
      <Title level={2}>
        <ShoppingCartOutlined /> Thanh toán
      </Title>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "20px",
        }}
      >
        {/* Form thông tin khách hàng */}
        <Card title="Thông tin giao hàng">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              paymentMethod: "COD",
            }}
          >
            <Form.Item
              name="customerName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="shippingAddress"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea placeholder="Nhập địa chỉ chi tiết" rows={3} />
            </Form.Item>

            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức thanh toán!",
                },
              ]}
            >
              <Select>
                <Option value="COD">Thanh toán khi nhận hàng (COD)</Option>
                <Option value="VNPAY">Thanh toán qua VNPay</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{ width: "100%" }}
                icon={<CreditCardOutlined />}
              >
                Đặt hàng
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Thông tin đơn hàng */}
        <Card title="Thông tin đơn hàng">
          <Space direction="vertical" style={{ width: "100%" }}>
            {checkoutItems.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong>{item.productName}</Text>
                    {item.variations && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {item.variations}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "4px",
                      }}
                    >
                      <Text>Số lượng: {item.quantity}</Text>
                      <Text strong style={{ color: "#ff4d4f" }}>
                        ₫{item.total.toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  </div>
                </div>
                {index < checkoutItems.length - 1 && (
                  <Divider style={{ margin: "12px 0" }} />
                )}
              </div>
            ))}

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong style={{ fontSize: "18px" }}>
                Tổng cộng:
              </Text>
              <Text strong style={{ fontSize: "18px", color: "#ff4d4f" }}>
                ₫{totalAmount.toLocaleString("vi-VN")}
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
