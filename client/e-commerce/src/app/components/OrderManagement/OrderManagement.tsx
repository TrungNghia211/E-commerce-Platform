import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Tooltip,
  Statistic,
  Row,
  Col,
  Pagination,
  App,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import orderApiRequest from "@/apiRequests/order";
import { OrderStatus } from "@/types/customer-order/types";
import { OrderResponseDto } from "@/types/seller-order/types";
import type { OrderDetailResponse } from "@/apiRequests/order";

const { Search } = Input;
const { Option } = Select;

interface Statistics {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

const OrderManagement = () => {
  const { message } = App.useApp();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDetailResponse | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState(false);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [form] = Form.useForm();

  const statusColors = {
    PENDING: "orange",
    CONFIRMED: "blue",
    PROCESSING: "cyan",
    SHIPPING: "purple",
    DELIVERED: "green",
    CANCELLED: "red",
  };

  const statusLabels = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
  };

  const paymentStatusColors = {
    PENDING: "orange",
    PAID: "green",
    FAILED: "red",
    CANCELLED: "red",
    REFUNDED: "purple",
  };

  const paymentStatusLabels = {
    PENDING: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    CANCELLED: "Đã hủy",
    REFUNDED: "Đã hoàn tiền",
  };

  const paymentMethodLabels = {
    COD: "Thanh toán khi nhận hàng",
    VNPAY: "VNPay",
  };

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sortBy: "createdAt",
        sortDir: "desc" as const,
        search: searchText || undefined,
        status: statusFilter || undefined,
      };

      const response = await orderApiRequest.getOrders(params);
      if (response.payload.code === 1000) {
        setOrders(response.payload.result.content);
        setPagination((prev) => ({
          ...prev,
          total: response.payload.result.totalElements,
        }));
      }
    } catch {
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await orderApiRequest.getStatistics();
      if (response.payload.code === 1000)
        setStatistics(response.payload.result);
    } catch {
      console.error("Lỗi khi tải thống kê");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value: OrderStatus | "") => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewDetail = async (orderId: number) => {
    try {
      const response = await orderApiRequest.getOrderDetail(orderId);
      if (response.payload.code === 1000) {
        setSelectedOrder(response.payload.result);
        setIsDetailModalVisible(true);
      }
    } catch {
      message.error("Lỗi khi tải chi tiết đơn hàng");
    }
  };

  const handleUpdateStatus = (order: OrderResponseDto) => {
    setSelectedOrder(order as unknown as OrderDetailResponse);
    form.setFieldsValue({ status: order.status });
    setIsUpdateStatusModalVisible(true);
  };

  const handleSubmitStatusUpdate = async (values: { status: OrderStatus }) => {
    try {
      if (!selectedOrder) return;
      const response = await orderApiRequest.updateOrderStatus(
        selectedOrder.id,
        values
      );
      if (response.payload.code === 1000) {
        message.success("Cập nhật trạng thái đơn hàng thành công");
        setIsUpdateStatusModalVisible(false);
        fetchOrders();
        fetchStatistics();
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const getValidStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
      PENDING: ["CONFIRMED" as OrderStatus, "CANCELLED" as OrderStatus],
      CONFIRMED: ["PROCESSING" as OrderStatus, "CANCELLED" as OrderStatus],
      PROCESSING: ["SHIPPING" as OrderStatus, "CANCELLED" as OrderStatus],
      SHIPPING: ["DELIVERED" as OrderStatus],
      DELIVERED: [],
      CANCELLED: [],
    };

    return validTransitions[currentStatus] || [];
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="font-mono text-blue-600">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 150,
      render: (_: unknown, record: OrderResponseDto) => (
        <div>
          <div className="font-medium truncate">{record.customerName}</div>
          <div className="text-gray-500 text-sm truncate">
            {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 200,
      render: (_: unknown, record: OrderResponseDto) => (
        <div className="flex items-center gap-2">
          <img
            src={record.productItem?.thumbnail || "/placeholder.jpg"}
            alt="Product"
            className="w-10 h-10 object-cover rounded flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <Tooltip title={record.productItem?.product?.name}>
              <div className="font-medium truncate">
                {record.productItem?.product?.name}
              </div>
            </Tooltip>
            <div className="text-gray-500 text-sm">SL: {record.quantity}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right" as const,
      render: (amount: number) => (
        <span className="font-medium text-green-600 whitespace-nowrap">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]} className="whitespace-nowrap">
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 130,
      render: (_: unknown, record: OrderResponseDto) => (
        <div>
          <Tag color={paymentStatusColors[record.paymentStatus]}>
            {paymentStatusLabels[record.paymentStatus]}
          </Tag>
          <div className="text-xs text-gray-500 mt-1 truncate">
            {paymentMethodLabels[record.paymentMethod]}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (date: string) => (
        <div className="whitespace-nowrap text-sm">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (_: unknown, record: OrderResponseDto) => (
        <Space size="small" className="whitespace-nowrap">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
              className="hover:text-blue-500"
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleUpdateStatus(record)}
              disabled={
                record.status === "DELIVERED" || record.status === "CANCELLED"
              }
              className="hover:text-green-500"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      {statistics && (
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={statistics.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={statistics.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã giao hàng"
                value={statistics.deliveredOrders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={statistics.totalRevenue}
                prefix={<DollarCircleOutlined />}
                formatter={(value) => {
                  if (typeof value === "number") {
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value);
                  }
                  return value;
                }}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Search */}
      {/* <Card> */}
      <div className="flex flex-wrap gap-4 items-center mb-[10px]">
        <Search
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, SĐT..."
          allowClear
          style={{ width: 420 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          allowClear
          onChange={handleStatusFilter}
        >
          <Option value="PENDING">Chờ xác nhận</Option>
          <Option value="CONFIRMED">Đã xác nhận</Option>
          <Option value="PROCESSING">Đang xử lý</Option>
          <Option value="SHIPPING">Đang giao hàng</Option>
          <Option value="DELIVERED">Đã giao hàng</Option>
          <Option value="CANCELLED">Đã hủy</Option>
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchOrders}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>
      {/* </Card> */}

      {/* Orders Table */}
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
          className="order-table"
          rowClassName="hover:bg-gray-50 transition-colors"
          size="middle"
        />
        <div className="p-4 flex justify-end bg-white border-t">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => (
              <span className="text-gray-500">
                {`${range[0]}-${range[1]} của ${total} đơn hàng`}
              </span>
            )}
            onChange={(page, size) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: size,
              }));
            }}
          />
        </div>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Mã đơn hàng:</span>{" "}
                    <span className="font-mono">{selectedOrder.orderCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>{" "}
                    <Tag color={statusColors[selectedOrder.status]}>
                      {statusLabels[selectedOrder.status]}
                    </Tag>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày tạo:</span>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </div>
                  <div>
                    <span className="text-gray-500">Số lượng:</span>{" "}
                    {selectedOrder.quantity}
                  </div>
                  <div>
                    <span className="text-gray-500">Tổng tiền:</span>{" "}
                    <span className="font-medium text-green-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Phương thức:</span>{" "}
                    {paymentMethodLabels[selectedOrder.paymentMethod]}
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>{" "}
                    <Tag
                      color={paymentStatusColors[selectedOrder.paymentStatus]}
                    >
                      {paymentStatusLabels[selectedOrder.paymentStatus]}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div>
                      <span className="text-gray-500">Tên:</span>{" "}
                      {selectedOrder.customerName}
                    </div>
                    <div>
                      <span className="text-gray-500">SĐT:</span>{" "}
                      {selectedOrder.customerPhone}
                    </div>
                  </div>
                  <div>
                    <div>
                      <span className="text-gray-500">Email:</span>{" "}
                      {selectedOrder.customerEmail}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div>
                    <span className="text-gray-500">Địa chỉ:</span>{" "}
                    {selectedOrder.shippingAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h3 className="font-medium mb-2">Thông tin sản phẩm</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedOrder.productItem?.thumbnail || "/placeholder.jpg"
                    }
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {selectedOrder.productItem?.product?.name}
                    </div>
                    <div className="text-gray-500">
                      SKU: {selectedOrder.productItem?.sku}
                    </div>
                    <div className="text-gray-500">
                      Danh mục:{" "}
                      {selectedOrder.productItem?.product?.category?.name}
                    </div>
                    {selectedOrder.productItem?.variationOptions?.length >
                      0 && (
                      <div className="text-gray-500">
                        Phân loại:{" "}
                        {selectedOrder.productItem.variationOptions
                          .map((opt) => `${opt.variation.name}: ${opt.value}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(selectedOrder.productItem?.price || 0)}
                    </div>
                    <div className="text-gray-500">
                      x{selectedOrder.quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isUpdateStatusModalVisible}
        onCancel={() => setIsUpdateStatusModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        {selectedOrder && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitStatusUpdate}
          >
            <div className="mb-4">
              <div>
                <span className="text-gray-500">Mã đơn hàng:</span>{" "}
                <span className="font-mono">{selectedOrder.orderCode}</span>
              </div>

              <div>
                <span className="text-gray-500">Trạng thái hiện tại:</span>{" "}
                <Tag color={statusColors[selectedOrder.status]}>
                  {statusLabels[selectedOrder.status]}
                </Tag>
              </div>
            </div>

            <Form.Item
              name="status"
              label="Trạng thái mới"
              rules={[
                { required: true, message: "Vui lòng chọn trạng thái mới" },
              ]}
            >
              <Select placeholder="Chọn trạng thái mới">
                {getValidStatusOptions(selectedOrder.status).map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColors[status]}>
                      {statusLabels[status]}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
