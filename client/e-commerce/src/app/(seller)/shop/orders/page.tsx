"use client";

import { Typography } from "antd";

import OrderManagement from "@/app/components/OrderManagement/OrderManagement";

const { Title } = Typography;

export default function OrdersPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <Title level={2} style={{ marginBottom: "10px" }}>
          Quản lý đơn hàng
        </Title>
      </div>

      <OrderManagement />
    </>
  );
}
