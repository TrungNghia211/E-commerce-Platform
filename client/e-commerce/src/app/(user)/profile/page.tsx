"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  notification,
  Modal,
  Descriptions,
  Image,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  OrderDetailDTO,
  OrderDTO,
  OrderListResponseDTO,
  OrderStatus,
} from "@/types/customer-order/types";
import { orderService } from "@/apiRequests/customerOrder";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodText,
  getStatusColor,
  getStatusText,
} from "@/app/utils/formatters";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ProfilePage() {
  const [profileForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState("profile");

  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [userProfile, setUserProfile] = useState(null);

  const [orders, setOrders] = useState<OrderDTO[]>([]);

  const [loading, setLoading] = useState(false);

  const [orderDetailModal, setOrderDetailModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderDetailDTO | null>(
    null
  );

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // const router = useRouter();

  const searchParams = useSearchParams();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab === "orders" ? "orders" : "profile");

    // loadUserProfile();
    if (tab === "orders") loadOrders();
  }, [searchParams]);

  // const loadUserProfile = async () => {
  //   try {
  //     const profile = await userService.getUserProfile();
  //     setUserProfile(profile);
  //     profileForm.setFieldsValue(profile);
  //   } catch (error) {
  //     console.error("Error loading user profile:", error);
  //     notification.error({
  //       message: "Lỗi",
  //       description: "Không thể tải thông tin người dùng!",
  //     });
  //   }
  // };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);

    if (!value.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const keyword = value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.productItem.productName.toLowerCase().includes(keyword) ||
        order.shop.name.toLowerCase().includes(keyword)
    );

    setFilteredOrders(filtered);
  };

  const loadOrders = async (page: number = 1, status?: OrderStatus) => {
    setLoading(true);

    try {
      let response: OrderListResponseDTO;

      if (dateRange)
        response = await orderService.getOrdersByDateRange(
          dateRange[0],
          dateRange[1],
          page - 1,
          pagination.pageSize
        );
      else
        response = await orderService.getCustomerOrders(
          page - 1,
          pagination.pageSize,
          status
        );

      setOrders(response.result.orders);
      setPagination({
        ...pagination,
        current: page,
        total: response.result.totalElements,
      });
    } catch (error) {
      console.error("Error loading orders:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách đơn hàng!",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateProfile = async (values: any) => {
  //   setLoading(true);
  //   try {
  //     const updatedProfile = await userService.updateUserProfile(values);
  //     setUserProfile(updatedProfile);

  //     notification.success({
  //       message: "Thành công",
  //       description: "Cập nhật thông tin thành công!",
  //     });
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     notification.error({
  //       message: "Lỗi",
  //       description: "Không thể cập nhật thông tin!",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleViewOrderDetail = async (orderId: number) => {
    try {
      setLoading(true);
      const orderDetail = await orderService.getOrderDetail(orderId);
      setSelectedOrder(orderDetail.result);
      setOrderDetailModal(true);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải chi tiết đơn hàng!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: OrderStatus | undefined) => {
    setStatusFilter(status);
    loadOrders(1, status);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) setDateRange(dateStrings);
    else setDateRange(null);
    loadOrders(1, statusFilter);
  };

  const handleTableChange = (paginationInfo: any) => {
    loadOrders(paginationInfo.current, statusFilter);
  };

  const orderColumns: ColumnsType<OrderDTO> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {record.productItem.thumbnail && (
            <Image
              src={record.productItem.thumbnail}
              width={40}
              height={40}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          )}
          <div>
            <Text strong>{record.productItem.productName}</Text>
            <br />
            <Text type="secondary">{record.shop.name}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          {formatCurrency(amount)}
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
      render: (date) => formatDate(date),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrderDetail(record.id)}
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
            <Avatar
              size={80}
              src={userProfile?.avatar}
              icon={<UserOutlined />}
            />
            <Title level={4} style={{ marginTop: "10px" }}>
              {userProfile?.fullName || "Người dùng"}
            </Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={({ key }) => {
              setActiveTab(key);
              if (key === "orders") {
                loadOrders();
              }
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
                  // onFinish={handleUpdateProfile}
                  // initialValues={userProfile}
                >
                  <Form.Item
                    name="fullName"
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

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card
                title="Đơn hàng của tôi"
                extra={
                  <Space>
                    <Input.Search
                      placeholder="Tìm kiếm theo tên sản phẩm hoặc tên shop"
                      allowClear
                      enterButton
                      onSearch={handleSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      style={{ width: 300 }}
                    />

                    <Select
                      placeholder="Lọc theo trạng thái"
                      allowClear
                      style={{ width: 150 }}
                      onChange={handleStatusFilterChange}
                    >
                      <Option value={OrderStatus.PENDING}>Chờ xác nhận</Option>
                      <Option value={OrderStatus.CONFIRMED}>Đã xác nhận</Option>
                      <Option value={OrderStatus.PROCESSING}>Đang xử lý</Option>
                      <Option value={OrderStatus.SHIPPING}>
                        Đang giao hàng
                      </Option>
                      <Option value={OrderStatus.DELIVERED}>Đã giao</Option>
                      <Option value={OrderStatus.CANCELLED}>Đã hủy</Option>
                    </Select>

                    {/* <RangePicker
                      placeholder={["Từ ngày", "Đến ngày"]}
                      onChange={handleDateRangeChange}
                      format="YYYY-MM-DD"
                    /> */}
                  </Space>
                }
              >
                <Table
                  columns={orderColumns}
                  // dataSource={orders}
                  dataSource={searchKeyword ? filteredOrders : orders}
                  rowKey="id"
                  loading={loading}
                  // pagination={{
                  //   ...pagination,
                  //   showSizeChanger: true,
                  //   showQuickJumper: true,
                  //   showTotal: (total, range) =>
                  //     `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  // }}
                  pagination={{
                    total: searchKeyword
                      ? filteredOrders.length
                      : orders.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  onChange={handleTableChange}
                />
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={orderDetailModal}
        onCancel={() => setOrderDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                <Text strong>{selectedOrder.orderCode}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày đặt">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Tổng tiền" span={2}>
                <Text strong style={{ color: "#ff4d4f", fontSize: "16px" }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Thông tin sản phẩm" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Image
                    src={selectedOrder.productItem.thumbnail}
                    width="100%"
                    style={{ borderRadius: "8px" }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                </Col>
                <Col span={18}>
                  <Title level={4}>
                    {selectedOrder.productItem.productName}
                  </Title>

                  {/* <br /> */}
                  <Text>Số lượng: {selectedOrder.quantity}</Text>
                  <br />
                  <Text>
                    Giá: {formatCurrency(selectedOrder.productItem.price)}
                  </Text>

                  {selectedOrder.productItem.variationOptions.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text strong>Thuộc tính:</Text>
                      <br />
                      {selectedOrder.productItem.variationOptions.map(
                        (option) => (
                          <Tag key={option.id} style={{ margin: "2px" }}>
                            {option.variationName}: {option.value}
                          </Tag>
                        )
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </Card>

            <Card title="Thông tin giao hàng" style={{ marginTop: 16 }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Người nhận">
                  {selectedOrder.customerName}
                </Descriptions.Item>

                <Descriptions.Item label="Số điện thoại">
                  {selectedOrder.customerPhone}
                </Descriptions.Item>

                <Descriptions.Item label="Địa chỉ">
                  {selectedOrder.shippingAddress}
                </Descriptions.Item>

                <Descriptions.Item label="Phương thức thanh toán">
                  {getPaymentMethodText(selectedOrder.paymentMethod)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
