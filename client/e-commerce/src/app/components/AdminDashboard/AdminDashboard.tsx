// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Statistic,
//   DatePicker,
//   Select,
//   Table,
//   Spin,
//   Typography,
//   Button,
//   Space,
// } from "antd";
// import type { RangePickerProps } from "antd/es/date-picker";
// import type { StatisticProps } from "antd/es/statistic/Statistic";
// import {
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   DollarOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
//   ShopOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
//   ReloadOutlined,
// } from "@ant-design/icons";

// import { statisticsApi } from "@/apiRequests/statistics";
// import {
//   AdminStatistics,
//   OverviewData,
//   StatisticsFilter,
//   OrderStatusCountData,
//   TopSellerData,
//   CategoryStatsData,
// } from "@/types/statistics/statistics";
// import {
//   formatCurrency,
//   formatNumber,
//   formatPercentage,
// } from "@/apiRequests/statistics";

// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const COLORS = [
//   "#1890ff",
//   "#52c41a",
//   "#faad14",
//   "#f5222d",
//   "#722ed1",
//   "#13c2c2",
//   "#eb2f96",
//   "#fa8c16",
// ];

// const formatStatisticValue: StatisticProps["formatter"] = (value) => {
//   return formatNumber(Number(value));
// };

// export const AdminDashboard: React.FC = () => {
//   const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
//   const [overview, setOverview] = useState<OverviewData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<StatisticsFilter>({
//     period: "MONTHLY",
//   });

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   useEffect(() => {
//     fetchOverview();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await statisticsApi.getAdminStatistics(filter);
//       setStatistics(response.payload);
//     } catch (error) {
//       console.error("Error fetching admin statistics:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOverview = async () => {
//     try {
//       const response = await statisticsApi.getAdminOverview();
//       setOverview(response.payload);
//     } catch (error) {
//       console.error("Error fetching admin overview:", error);
//     }
//   };

//   const handleDateRangeChange: RangePickerProps["onChange"] = (
//     dates,
//     dateStrings
//   ) => {
//     if (dates) {
//       setFilter({
//         ...filter,
//         startDate: dateStrings[0],
//         endDate: dateStrings[1],
//       });
//     } else {
//       const newFilter = { ...filter };
//       delete newFilter.startDate;
//       delete newFilter.endDate;
//       setFilter(newFilter);
//     }
//   };

//   const getGrowthIcon = (growth: number) => {
//     return growth >= 0 ? (
//       <ArrowUpOutlined style={{ color: "#52c41a" }} />
//     ) : (
//       <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
//     );
//   };

//   const getGrowthColor = (growth: number) => {
//     return growth >= 0 ? "#52c41a" : "#ff4d4f";
//   };

//   if (loading && !statistics) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "60vh",
//           background: "#f5f5f5",
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         padding: "24px",
//         background: "#f0f2f5",
//         minHeight: "100vh",
//       }}
//     >
//       {/* Header */}
//       <div style={{ marginBottom: 32 }}>
//         <Title
//           level={2}
//           style={{
//             margin: 0,
//             color: "#1a1a1a",
//             fontWeight: 600,
//           }}
//         >
//           Bảng điều khiển quản trị
//         </Title>
//         <Text type="secondary" style={{ fontSize: 16 }}>
//           Theo dõi và phân tích hiệu quả hoạt động của hệ thống
//         </Text>
//       </div>

//       {/* Filters */}
//       <Card
//         style={{
//           marginBottom: 24,
//           borderRadius: 12,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//         }}
//       >
//         <Row gutter={[16, 16]} align="middle">
//           <Col>
//             <Text strong style={{ fontSize: 16, color: "#1a1a1a" }}>
//               Bộ lọc:
//             </Text>
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <RangePicker
//               onChange={handleDateRangeChange}
//               format="DD/MM/YYYY"
//               placeholder={["Từ ngày", "Đến ngày"]}
//               style={{ width: "100%" }}
//               size="middle"
//             />
//           </Col>
//           <Col xs={12} sm={8} md={6} lg={4}>
//             <Select
//               value={filter.period}
//               onChange={(value) => setFilter({ ...filter, period: value })}
//               style={{ width: "100%" }}
//               size="middle"
//             >
//               <Option value="DAILY">Hàng ngày</Option>
//               <Option value="WEEKLY">Hàng tuần</Option>
//               <Option value="MONTHLY">Hàng tháng</Option>
//               <Option value="YEARLY">Hàng năm</Option>
//             </Select>
//           </Col>
//           <Col xs={12} sm={8} md={6} lg={4}>
//             <Button
//               onClick={fetchData}
//               loading={loading}
//               icon={<ReloadOutlined />}
//               type="primary"
//               size="middle"
//               style={{ width: "100%" }}
//             >
//               Làm mới
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Overview Statistics */}
//       {overview && (
//         <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 border: "none",
//               }}
//             >
//               <Statistic
//                 title={
//                   <span style={{ color: "#fff", fontWeight: 500 }}>
//                     Tổng doanh thu
//                   </span>
//                 }
//                 value={statistics?.totalRevenue || 0}
//                 formatter={(value) => formatCurrency(Number(value))}
//                 prefix={<DollarOutlined style={{ color: "#fff" }} />}
//                 valueStyle={{ color: "#fff", fontWeight: 600 }}
//                 suffix={
//                   overview.growth.revenue !== undefined && (
//                     <div style={{ marginTop: 8 }}>
//                       <Text
//                         style={{
//                           fontSize: "12px",
//                           color: "#e6fffb",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 4,
//                         }}
//                       >
//                         {getGrowthIcon(overview.growth.revenue)}
//                         {formatPercentage(overview.growth.revenue)}
//                       </Text>
//                     </div>
//                   )
//                 }
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//                 border: "none",
//               }}
//             >
//               <Statistic
//                 title={
//                   <span style={{ color: "#fff", fontWeight: 500 }}>
//                     Tổng đơn hàng
//                   </span>
//                 }
//                 value={statistics?.totalOrders || 0}
//                 formatter={formatStatisticValue}
//                 prefix={<ShoppingCartOutlined style={{ color: "#fff" }} />}
//                 valueStyle={{ color: "#fff", fontWeight: 600 }}
//                 suffix={
//                   overview.growth.orders !== undefined && (
//                     <div style={{ marginTop: 8 }}>
//                       <Text
//                         style={{
//                           fontSize: "12px",
//                           color: "#e6fffb",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 4,
//                         }}
//                       >
//                         {getGrowthIcon(overview.growth.orders)}
//                         {formatPercentage(overview.growth.orders)}
//                       </Text>
//                     </div>
//                   )
//                 }
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//                 border: "none",
//               }}
//             >
//               <Statistic
//                 title={
//                   <span style={{ color: "#fff", fontWeight: 500 }}>
//                     Tổng người dùng
//                   </span>
//                 }
//                 value={statistics?.totalUsers || 0}
//                 formatter={formatNumber}
//                 prefix={<UserOutlined style={{ color: "#fff" }} />}
//                 valueStyle={{ color: "#fff", fontWeight: 600 }}
//                 suffix={
//                   overview.growth.users !== undefined && (
//                     <div style={{ marginTop: 8 }}>
//                       <Text
//                         style={{
//                           fontSize: "12px",
//                           color: "#e6fffb",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 4,
//                         }}
//                       >
//                         {getGrowthIcon(overview.growth.users)}
//                         {formatPercentage(overview.growth.users)}
//                       </Text>
//                     </div>
//                   )
//                 }
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
//                 border: "none",
//               }}
//             >
//               <Statistic
//                 title={
//                   <span style={{ color: "#fff", fontWeight: 500 }}>
//                     Tổng phí sàn
//                   </span>
//                 }
//                 value={statistics?.totalPlatformFee || 0}
//                 formatter={(value) => formatCurrency(Number(value))}
//                 prefix={<ShopOutlined style={{ color: "#fff" }} />}
//                 valueStyle={{ color: "#fff", fontWeight: 600 }}
//               />
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Charts Section */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} lg={16}>
//           <Card
//             title={
//               <Space>
//                 <span style={{ fontSize: 18, fontWeight: 600 }}>
//                   Biểu đồ doanh thu theo thời gian
//                 </span>
//               </Space>
//             }
//             loading={loading}
//             style={{
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//             }}
//             headStyle={{
//               borderBottom: "2px solid #f0f0f0",
//               paddingBottom: 16,
//             }}
//           >
//             <ResponsiveContainer width="100%" height={400}>
//               <AreaChart data={statistics?.monthlyRevenue || []}>
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
//                   </linearGradient>
//                   <linearGradient
//                     id="colorPlatformFee"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
//                 <XAxis
//                   dataKey="month"
//                   tick={{ fontSize: 12 }}
//                   axisLine={{ stroke: "#d9d9d9" }}
//                 />
//                 <YAxis
//                   tickFormatter={(value: number) =>
//                     new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                       notation: "compact",
//                     }).format(value)
//                   }
//                   tick={{ fontSize: 12 }}
//                   axisLine={{ stroke: "#d9d9d9" }}
//                 />
//                 <Tooltip
//                   formatter={(value: number) =>
//                     new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                     }).format(value)
//                   }
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: "1px solid #e8e8e8",
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stackId="1"
//                   stroke="#1890ff"
//                   fill="url(#colorRevenue)"
//                   strokeWidth={2}
//                   name="Doanh thu"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="platformFee"
//                   stackId="2"
//                   stroke="#52c41a"
//                   fill="url(#colorPlatformFee)"
//                   strokeWidth={2}
//                   name="Phí sàn"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//         <Col xs={24} lg={8}>
//           <Card
//             title={
//               <span style={{ fontSize: 18, fontWeight: 600 }}>
//                 Phân bố trạng thái đơn hàng
//               </span>
//             }
//             loading={loading}
//             style={{
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//             }}
//             headStyle={{
//               borderBottom: "2px solid #f0f0f0",
//               paddingBottom: 16,
//             }}
//           >
//             <ResponsiveContainer width="100%" height={400}>
//               <PieChart>
//                 <Pie
//                   data={statistics?.orderStatusStats || []}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({
//                     status,
//                     percent,
//                   }: OrderStatusCountData & { percent: number }) =>
//                     `${status} ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={120}
//                   fill="#8884d8"
//                   dataKey="count"
//                   stroke="none"
//                 >
//                   {statistics?.orderStatusStats?.map(
//                     (entry: OrderStatusCountData, index: number) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     )
//                   )}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: "1px solid #e8e8e8",
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Tables Section */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} lg={12}>
//           <Card
//             title={
//               <span style={{ fontSize: 18, fontWeight: 600 }}>
//                 Top người bán xuất sắc
//               </span>
//             }
//             loading={loading}
//             style={{
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//             }}
//             headStyle={{
//               borderBottom: "2px solid #f0f0f0",
//               paddingBottom: 16,
//             }}
//           >
//             <Table
//               dataSource={statistics?.topSellers || []}
//               pagination={false}
//               size="middle"
//               rowKey={(record) => record.sellerName}
//               columns={[
//                 {
//                   title: "Tên shop",
//                   dataIndex: "sellerName",
//                   key: "sellerName",
//                   ellipsis: true,
//                   render: (text: string) => (
//                     <Text strong style={{ color: "#1890ff" }}>
//                       {text}
//                     </Text>
//                   ),
//                 },
//                 {
//                   title: "Doanh thu",
//                   dataIndex: "totalRevenue",
//                   key: "totalRevenue",
//                   render: (value: number) => (
//                     <Text strong style={{ color: "#52c41a" }}>
//                       {formatCurrency(value)}
//                     </Text>
//                   ),
//                   sorter: (a: TopSellerData, b: TopSellerData) =>
//                     a.totalRevenue - b.totalRevenue,
//                   align: "right",
//                 },
//                 {
//                   title: "Đơn hàng",
//                   dataIndex: "totalOrders",
//                   key: "totalOrders",
//                   render: (value: number) => formatNumber(value),
//                   align: "center",
//                 },
//                 {
//                   title: "Phí sàn",
//                   dataIndex: "platformFee",
//                   key: "platformFee",
//                   render: (value: number) => (
//                     <Text style={{ color: "#fa8c16" }}>
//                       {formatCurrency(value)}
//                     </Text>
//                   ),
//                   align: "right",
//                 },
//               ]}
//               style={{
//                 background: "#fafafa",
//                 borderRadius: 8,
//               }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} lg={12}>
//           <Card
//             title={
//               <span style={{ fontSize: 18, fontWeight: 600 }}>
//                 Thống kê theo danh mục
//               </span>
//             }
//             loading={loading}
//             style={{
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//             }}
//             headStyle={{
//               borderBottom: "2px solid #f0f0f0",
//               paddingBottom: 16,
//             }}
//           >
//             <Table
//               dataSource={statistics?.categoryStats || []}
//               pagination={false}
//               size="middle"
//               rowKey={(record) => record.categoryName}
//               columns={[
//                 {
//                   title: "Danh mục",
//                   dataIndex: "categoryName",
//                   key: "categoryName",
//                   ellipsis: true,
//                   render: (text: string) => (
//                     <Text strong style={{ color: "#722ed1" }}>
//                       {text}
//                     </Text>
//                   ),
//                 },
//                 {
//                   title: "SP",
//                   dataIndex: "productCount",
//                   key: "productCount",
//                   render: (value: number) => formatNumber(value),
//                   align: "center",
//                   width: 80,
//                 },
//                 {
//                   title: "Đã bán",
//                   dataIndex: "totalSold",
//                   key: "totalSold",
//                   render: (value: number) => formatNumber(value),
//                   align: "center",
//                   width: 80,
//                 },
//                 {
//                   title: "Doanh thu",
//                   dataIndex: "revenue",
//                   key: "revenue",
//                   render: (value: number) => (
//                     <Text strong style={{ color: "#f5222d" }}>
//                       {formatCurrency(value)}
//                     </Text>
//                   ),
//                   sorter: (a: CategoryStatsData, b: CategoryStatsData) =>
//                     a.revenue - b.revenue,
//                   align: "right",
//                 },
//               ]}
//               style={{
//                 background: "#fafafa",
//                 borderRadius: 8,
//               }}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

"use client";

import React, { useState, useEffect } from "react";
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
  Button,
  Space,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { StatisticProps } from "antd/es/statistic/Statistic";
import {
  AreaChart,
  Area,
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
  UserOutlined,
  ShopOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { statisticsApi } from "@/apiRequests/statistics";
import {
  AdminStatistics,
  OverviewData,
  StatisticsFilter,
  OrderStatusCountData,
  TopSellerData,
  CategoryStatsData,
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

const formatStatisticValue: StatisticProps["formatter"] = (value) => {
  return formatNumber(Number(value));
};

export const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatisticsFilter>({
    period: "MONTHLY",
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await statisticsApi.getAdminStatistics(filter);
      setStatistics(response.payload);
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await statisticsApi.getAdminOverview();
      setOverview(response.payload);
    } catch (error) {
      console.error("Error fetching admin overview:", error);
    }
  };

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

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "#52c41a" : "#ff4d4f";
  };

  if (loading && !statistics) {
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
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
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
          Bảng điều khiển quản trị
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Theo dõi và phân tích hiệu quả hoạt động của hệ thống
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
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#fff", fontWeight: 500 }}>
                    Tổng doanh thu
                  </span>
                }
                value={statistics?.totalRevenue || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: "#fff" }} />}
                valueStyle={{ color: "#fff", fontWeight: 600 }}
                suffix={
                  overview.growth.revenue !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#e6fffb",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {getGrowthIcon(overview.growth.revenue)}
                        {formatPercentage(overview.growth.revenue)}
                      </Text>
                    </div>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#fff", fontWeight: 500 }}>
                    Tổng đơn hàng
                  </span>
                }
                value={statistics?.totalOrders || 0}
                formatter={formatStatisticValue}
                prefix={<ShoppingCartOutlined style={{ color: "#fff" }} />}
                valueStyle={{ color: "#fff", fontWeight: 600 }}
                suffix={
                  overview.growth.orders !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#e6fffb",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {getGrowthIcon(overview.growth.orders)}
                        {formatPercentage(overview.growth.orders)}
                      </Text>
                    </div>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#fff", fontWeight: 500 }}>
                    Tổng người dùng
                  </span>
                }
                value={statistics?.totalUsers || 0}
                formatter={formatNumber}
                prefix={<UserOutlined style={{ color: "#fff" }} />}
                valueStyle={{ color: "#fff", fontWeight: 600 }}
                suffix={
                  overview.growth.users !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#e6fffb",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {getGrowthIcon(overview.growth.users)}
                        {formatPercentage(overview.growth.users)}
                      </Text>
                    </div>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#fff", fontWeight: 500 }}>
                    Tổng phí sàn
                  </span>
                }
                value={statistics?.totalPlatformFee || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<ShopOutlined style={{ color: "#fff" }} />}
                valueStyle={{ color: "#fff", fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                  Biểu đồ doanh thu theo thời gian
                </span>
              </Space>
            }
            loading={loading}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{
              header: {
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: 16,
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={statistics?.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorPlatformFee"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <YAxis
                  tickFormatter={(value: number) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                    }).format(value)
                  }
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#1890ff"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Doanh thu"
                />
                <Area
                  type="monotone"
                  dataKey="platformFee"
                  stackId="2"
                  stroke="#52c41a"
                  fill="url(#colorPlatformFee)"
                  strokeWidth={2}
                  name="Phí sàn"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                Phân bố trạng thái đơn hàng
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{
              header: {
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: 16,
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={statistics?.orderStatusStats || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    status,
                    percent,
                  }: OrderStatusCountData & { percent: number }) =>
                    `${status} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="none"
                >
                  {statistics?.orderStatusStats?.map(
                    (entry: OrderStatusCountData, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tables Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                Top người bán xuất sắc
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{
              header: {
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: 16,
              },
            }}
          >
            <Table
              dataSource={statistics?.topSellers || []}
              pagination={false}
              size="middle"
              rowKey={(record) => record.sellerName}
              columns={[
                {
                  title: "Tên shop",
                  dataIndex: "sellerName",
                  key: "sellerName",
                  ellipsis: true,
                  render: (text: string) => (
                    <Text strong style={{ color: "#1890ff" }}>
                      {text}
                    </Text>
                  ),
                },
                {
                  title: "Doanh thu",
                  dataIndex: "totalRevenue",
                  key: "totalRevenue",
                  render: (value: number) => (
                    <Text strong style={{ color: "#52c41a" }}>
                      {formatCurrency(value)}
                    </Text>
                  ),
                  sorter: (a: TopSellerData, b: TopSellerData) =>
                    a.totalRevenue - b.totalRevenue,
                  align: "right",
                },
                {
                  title: "Đơn hàng",
                  dataIndex: "totalOrders",
                  key: "totalOrders",
                  render: (value: number) => formatNumber(value),
                  align: "center",
                },
                {
                  title: "Phí sàn",
                  dataIndex: "platformFee",
                  key: "platformFee",
                  render: (value: number) => (
                    <Text style={{ color: "#fa8c16" }}>
                      {formatCurrency(value)}
                    </Text>
                  ),
                  align: "right",
                },
              ]}
              style={{
                background: "#fafafa",
                borderRadius: 8,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                Thống kê theo danh mục
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{
              header: {
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: 16,
              },
            }}
          >
            <Table
              dataSource={statistics?.categoryStats || []}
              pagination={false}
              size="middle"
              rowKey={(record) => record.categoryName}
              columns={[
                {
                  title: "Danh mục",
                  dataIndex: "categoryName",
                  key: "categoryName",
                  ellipsis: true,
                  render: (text: string) => (
                    <Text strong style={{ color: "#722ed1" }}>
                      {text}
                    </Text>
                  ),
                },
                {
                  title: "SP",
                  dataIndex: "productCount",
                  key: "productCount",
                  render: (value: number) => formatNumber(value),
                  align: "center",
                  width: 80,
                },
                {
                  title: "Đã bán",
                  dataIndex: "totalSold",
                  key: "totalSold",
                  render: (value: number) => formatNumber(value),
                  align: "center",
                  width: 80,
                },
                {
                  title: "Doanh thu",
                  dataIndex: "revenue",
                  key: "revenue",
                  render: (value: number) => (
                    <Text strong style={{ color: "#f5222d" }}>
                      {formatCurrency(value)}
                    </Text>
                  ),
                  sorter: (a: CategoryStatsData, b: CategoryStatsData) =>
                    a.revenue - b.revenue,
                  align: "right",
                },
              ]}
              style={{
                background: "#fafafa",
                borderRadius: 8,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
