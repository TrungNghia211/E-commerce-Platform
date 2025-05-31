"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Image,
  Space,
  Button,
  Typography,
  Pagination,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import productApiRequest from "@/apiRequests/product";

const { Title } = Typography;

interface ProductData {
  id: number;
  name: string;
  thumbnail: string | null;
  categoryName: string;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);

  const columns: ColumnsType<ProductData> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div
          style={{
            maxWidth: "140px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={text}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text: string | null) =>
        text ? (
          <Image src={text} alt="Product Thumbnail" width={50} />
        ) : (
          "No Thumbnail"
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: ProductData) => (
        <Space size="middle">
          <Button type="primary">Sửa</Button>
          <Button type="primary" danger>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  const fetchProducts = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await productApiRequest.getSellerProducts(page, size);
      if (response.payload.code === 1000 && response.payload.result) {
        setProducts(response.payload.result.content);
        setTotalProducts(response.payload.result.totalElements);
      } else message.error("Failed to fetch products.");
    } catch (error) {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div>
      <Title level={2}>Quản lý Sản phẩm</Title>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalProducts}
        onChange={handlePageChange}
        showSizeChanger
        style={{
          textAlign: "right",
          marginTop: "10px",
        }}
      />
    </div>
  );
}
