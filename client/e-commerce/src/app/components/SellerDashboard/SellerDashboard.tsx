"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Table,
  Spin,
  Typography,
  Progress,
  Space,
  Button,
  Tag,
  Avatar,
  Empty,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  PercentageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { StatisticProps } from "antd";

import { statisticsApi } from "@/apiRequests/statistics";
import {
  SellerStatistics,
  OverviewData,
  StatisticsFilter,
  ProductStatsData,
  OrderStatusCountData,
} from "@/types/statistics/statistics";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/apiRequests/statistics";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
  "#fa8c16",
];

export const SellerDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<SellerStatistics | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatisticsFilter>({
    period: "MONTHLY",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!mounted) return;

    try {
      setLoading(true);
      const response = await statisticsApi.getSellerStatistics(filter);
      if (mounted) setStatistics(response.payload);
    } catch (error) {
      console.error("Error fetching seller statistics:", error);
    } finally {
      if (mounted) setLoading(false);
    }
  }, [filter, mounted]);

  const fetchOverview = useCallback(async () => {
    if (!mounted) return;

    try {
      const response = await statisticsApi.getSellerOverview();
      if (mounted) setOverview(response.payload);
    } catch (error) {
      console.error("Error fetching seller overview:", error);
    }
  }, [mounted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleDateRangeChange: RangePickerProps["onChange"] = (
    dates,
    dateStrings
  ) => {
    if (dates) {
      setFilter({
        ...filter,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    } else {
      const newFilter = { ...filter };
      delete newFilter.startDate;
      delete newFilter.endDate;
      setFilter(newFilter);
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpOutlined style={{ color: "#52c41a" }} />
    ) : (
      <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
    );
  };

  const getGrowthColor = (growth: number) =>
    growth >= 0 ? "#52c41a" : "#ff4d4f";

  const getOrderStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: "orange",
      CONFIRMED: "blue",
      PROCESSING: "cyan",
      SHIPPED: "purple",
      DELIVERED: "green",
      CANCELLED: "red",
      REFUNDED: "magenta",
    };
    return colors[status] || "default";
  };

  const getOrderStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      PENDING: "Chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPED: "Đã gửi hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
      REFUNDED: "Đã hoàn tiền",
    };
    return texts[status] || status;
  };

  // Columns for top products table
  const topProductsColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: ProductStatsData) => (
        <Space>
          <Avatar
            src={record.thumbnail}
            shape="square"
            size={48}
            icon={<ProductOutlined />}
          />
          <div>
            <Text strong style={{ display: "block" }}>
              {text}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ID: {record.productId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Đã bán",
      dataIndex: "quantitySold",
      key: "quantitySold",
      sorter: (a: ProductStatsData, b: ProductStatsData) =>
        a.quantitySold - b.quantitySold,
      render: (value: number) => formatNumber(value),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a: ProductStatsData, b: ProductStatsData) =>
        a.revenue - b.revenue,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Đánh giá",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (value: number) => (
        <Space>
          <StarOutlined style={{ color: "#faad14" }} />
          <Text>{value ? value.toFixed(1) : "N/A"}</Text>
        </Space>
      ),
    },
  ];

  // Prepare order status chart data
  const orderStatusChartData =
    statistics?.orderStatusStats?.map((item: OrderStatusCountData) => ({
      name: getOrderStatusText(item.status),
      value: item.count,
      amount: item.totalAmount,
    })) || [];

  if (!mounted) return null;

  if (loading && !statistics)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          background: "#f5f5f5",
        }}
      >
        <Spin size="large" />
      </div>
    );

  // Fix formatter type issues
  const formatStatisticValue: StatisticProps["formatter"] = (value) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return formatNumber(numValue);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#1a1a1a",
            fontWeight: 600,
          }}
        >
          Bảng điều khiển người bán
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Theo dõi và phân tích hiệu quả hoạt động của cửa hàng
        </Text>
      </div>

      {/* Filters */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Text strong style={{ fontSize: 16, color: "#1a1a1a" }}>
              Bộ lọc:
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ width: "100%" }}
              size="middle"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Select
              value={filter.period}
              onChange={(value) => setFilter({ ...filter, period: value })}
              style={{ width: "100%" }}
              size="middle"
            >
              <Option value="DAILY">Hàng ngày</Option>
              <Option value="WEEKLY">Hàng tuần</Option>
              <Option value="MONTHLY">Hàng tháng</Option>
              <Option value="YEARLY">Hàng năm</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Button
              onClick={fetchData}
              loading={loading}
              icon={<ReloadOutlined />}
              type="primary"
              size="middle"
              style={{ width: "100%" }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Overview Statistics */}
      {overview && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={statistics?.totalRevenue || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                suffix={
                  overview.growth.revenue !== undefined && (
                    <Text
                      style={{
                        fontSize: "12px",
                        color: getGrowthColor(overview.growth.revenue),
                      }}
                    >
                      {getGrowthIcon(overview.growth.revenue)}{" "}
                      {formatPercentage(overview.growth.revenue)}
                    </Text>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Thu nhập thực"
                value={statistics?.totalSellerEarnings || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                suffix={
                  overview.growth.earnings !== undefined && (
                    <Text
                      style={{
                        fontSize: "12px",
                        color: getGrowthColor(overview.growth.earnings),
                      }}
                    >
                      {getGrowthIcon(overview.growth.earnings)}{" "}
                      {formatPercentage(overview.growth.earnings)}
                    </Text>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn hàng"
                value={statistics?.totalOrders || 0}
                formatter={formatStatisticValue}
                prefix={<ShoppingCartOutlined />}
                suffix={
                  overview.growth.orders !== undefined && (
                    <Text
                      style={{
                        fontSize: "12px",
                        color: getGrowthColor(overview.growth.orders),
                      }}
                    >
                      {getGrowthIcon(overview.growth.orders)}{" "}
                      {formatPercentage(overview.growth.orders)}
                    </Text>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Phí sàn"
                value={statistics?.totalPlatformFee || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<PercentageOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={statistics?.totalProducts || 0}
              formatter={formatStatisticValue}
              prefix={<ProductOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm đã bán"
              value={statistics?.totalProductsSold || 0}
              formatter={formatStatisticValue}
              prefix={<ProductOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Tỷ lệ chuyển đổi</Text>
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={
                  statistics?.totalProducts && statistics?.totalProductsSold
                    ? Math.round(
                        (statistics.totalProductsSold /
                          statistics.totalProducts) *
                          100
                      )
                    : 0
                }
                status="active"
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Hiệu quả phí sàn</Text>
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: "16px" }}>
                {statistics?.totalRevenue && statistics?.totalPlatformFee
                  ? `${(
                      (statistics.totalPlatformFee / statistics.totalRevenue) *
                      100
                    ).toFixed(1)}%`
                  : "5%"}
              </Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                của doanh thu
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart and Order Status */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ doanh thu và thu nhập" loading={loading}>
            {statistics?.monthlyRevenue &&
            statistics.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={statistics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Doanh thu"
                  />
                  <Area
                    type="monotone"
                    dataKey="sellerEarnings"
                    stackId="2"
                    stroke="#52c41a"
                    fill="#52c41a"
                    name="Thu nhập thực"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Không có dữ liệu doanh thu" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái đơn hàng" loading={loading}>
            {orderStatusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={orderStatusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Không có dữ liệu đơn hàng" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Order Status Details */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Chi tiết trạng thái đơn hàng" loading={loading}>
            <Row gutter={16}>
              {statistics?.orderStatusStats?.map((item) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={item.status}
                  style={{ marginBottom: 16 }}
                >
                  <Card size="small" style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: 8 }}>
                      <Tag
                        color={getOrderStatusColor(item.status)}
                        style={{ marginBottom: 4 }}
                      >
                        {getOrderStatusText(item.status)}
                      </Tag>
                    </div>
                    <Statistic
                      value={item.count}
                      formatter={formatStatisticValue}
                      suffix="đơn"
                      valueStyle={{ fontSize: "16px" }}
                    />
                    <Text
                      type="secondary"
                      style={{ display: "block", marginTop: 4 }}
                    >
                      {formatCurrency(item.totalAmount)}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Top Products Table */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Sản phẩm bán chạy nhất" loading={loading}>
            {statistics?.topProducts && statistics.topProducts.length > 0 ? (
              <Table
                columns={topProductsColumns}
                dataSource={statistics.topProducts}
                rowKey="productId"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}
                scroll={{ x: 800 }}
              />
            ) : (
              <Empty description="Không có dữ liệu sản phẩm" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Monthly Performance Chart */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Hiệu suất theo tháng" loading={loading}>
            {statistics?.monthlyRevenue &&
            statistics.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={statistics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "orderCount"
                        ? formatNumber(Number(value))
                        : formatCurrency(Number(value)),
                      name === "orderCount"
                        ? "Số đơn hàng"
                        : name === "revenue"
                        ? "Doanh thu"
                        : name === "sellerEarnings"
                        ? "Thu nhập thực"
                        : "Phí sàn",
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="orderCount"
                    fill="#8884d8"
                    name="Số đơn hàng"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill="#82ca9d"
                    name="Doanh thu"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="sellerEarnings"
                    fill="#52c41a"
                    name="Thu nhập thực"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Không có dữ liệu hiệu suất" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
