"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Layout,
  Menu,
  Card,
  Table,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Tag,
  Avatar,
  Divider,
  notification,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Order {
  id: number;
  orderCode: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm] = Form.useForm();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab === "orders" ? "orders" : "profile");
    }

    // Load user profile and orders
    loadUserData();
  }, [searchParams]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Mock data - thay thế bằng API calls thực tế
      setUserProfile({
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0123456789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
      });

      setOrders([
        {
          id: 1,
          orderCode: "DH001",
          productName: "iPhone 15 Pro Max",
          quantity: 1,
          totalPrice: 30000000,
          status: "COMPLETED",
          paymentMethod: "VNPAY",
          createdAt: "2024-03-15",
          shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
        },
        {
          id: 2,
          orderCode: "DH002",
          productName: "Samsung Galaxy S24",
          quantity: 1,
          totalPrice: 25000000,
          status: "PROCESSING",
          paymentMethod: "COD",
          createdAt: "2024-03-20",
          shippingAddress: "456 Đường XYZ, Quận 2, TP.HCM",
        },
      ]);
    } catch (error) {
      console.error("Error loading user data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin người dùng!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      // Call API to update profile
      console.log("Updating profile:", values);

      // Mock success
      notification.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công!",
      });

      // Update local state
      setUserProfile({ ...userProfile!, ...values });
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật thông tin!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "PROCESSING":
        return "blue";
      case "CANCELLED":
        return "red";
      case "PENDING":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "PROCESSING":
        return "Đang xử lý";
      case "CANCELLED":
        return "Đã hủy";
      case "PENDING":
        return "Chờ xác nhận";
      default:
        return status;
    }
  };

  const orderColumns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          ₫{price.toLocaleString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => console.log("View order:", record.id)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Tài khoản của tôi",
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "Đơn mua",
    },
  ];

  return (
    <div className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]">
      <Layout style={{ background: "#fff" }}>
        <Sider width={250} style={{ background: "#fff" }}>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: "10px" }}>
              {userProfile?.name || "Người dùng"}
            </Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={({ key }) => {
              setActiveTab(key);
              // router.push(`/profile?tab=${key}`);
            }}
          />
        </Sider>

        <Layout style={{ marginLeft: "20px" }}>
          <Content>
            {activeTab === "profile" && (
              <Card title="Thông tin tài khoản" extra={<EditOutlined />}>
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  // initialValues={userProfile}
                >
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card title="Đơn hàng của tôi">
                <Table
                  columns={orderColumns}
                  dataSource={orders}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                />
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
