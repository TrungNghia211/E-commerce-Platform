"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Descriptions,
  Typography,
  Space,
  Button,
  Table,
  Image,
  Tag,
  Spin,
  message,
} from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import productApiRequest from "@/apiRequests/product";

const { Title } = Typography;

interface ProductDetail {
  id: number;
  name: string;
  quantityInStock: number;
  price: number;
  buyTurn: number;
  description: string;
  thumbnail: string | null;
  purchaseCount: number | null;
  categoryName: string;
  shop: Record<string, unknown> | null;
  variations: {
    id: number;
    name: string;
    variationOptions: {
      id: number;
      value: string;
    }[];
  }[];
  productItems: {
    id: number;
    quantityInStock: number;
    price: number;
    thumbnail: string | null;
    variationOptions: {
      id: number;
      value: string;
    }[];
  }[];
}

interface ProductItemTableData {
  key: string;
  sku: string;
  price: number;
  quantityInStock: number;
  thumbnail: string | null;
  variations: { name: string; value: string }[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productItems, setProductItems] = useState<ProductItemTableData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Separate effect for error handling
  useEffect(() => {
    if (error) {
      message.error(error);
      router.push("/shop/products");
    }
  }, [error, router]);

  // Main effect for data fetching
  useEffect(() => {
    let isMounted = true;
    let messageInstance: ReturnType<typeof message.loading> | null = null;

    const fetchProductDetail = async () => {
      try {
        // if (isMounted) {
        //   messageInstance = message.loading("Loading product details...", 0);
        // }

        const response = await productApiRequest.getSellerProductDetail(
          parseInt(resolvedParams.id)
        );

        if (!isMounted) {
          messageInstance?.();
          return;
        }

        if (response.payload.code === 1000 && response.payload.result) {
          const productData = response.payload.result;
          setProduct(productData);

          if (productData.productItems) {
            const items = productData.productItems.map(
              (item: ProductDetail["productItems"][0]) => ({
                key: item.id.toString(),
                price: item.price,
                quantityInStock: item.quantityInStock,
                thumbnail: item.thumbnail,
                variations: item.variationOptions.map(
                  (
                    opt: ProductDetail["productItems"][0]["variationOptions"][0]
                  ) => ({
                    name:
                      productData.variations.find(
                        (v: ProductDetail["variations"][0]) =>
                          v.variationOptions.some(
                            (
                              vo: ProductDetail["variations"][0]["variationOptions"][0]
                            ) => vo.id === opt.id
                          )
                      )?.name || "",
                    value: opt.value,
                  })
                ),
              })
            );
            setProductItems(items);
          }
        }
      } catch {
        if (isMounted) {
          setError("Failed to load product details");
        }
      } finally {
        if (isMounted) {
          messageInstance?.();
          setLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
      messageInstance?.();
    };
  }, [resolvedParams.id]);

  const columns: ColumnsType<ProductItemTableData> = [
    {
      title: "Phân loại",
      key: "variations",
      render: (_, record) => (
        <Space direction="vertical">
          {record.variations.map((variation, index) => (
            <Tag key={index}>
              {variation.name}: {variation.value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string | null) =>
        thumbnail ? (
          <Image
            src={thumbnail}
            alt="Product Item Thumbnail"
            width={50}
            preview={false}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} ₫`,
    },
    {
      title: "Tồn kho",
      dataIndex: "quantityInStock",
      key: "quantityInStock",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Space style={{ marginBottom: "20px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/shop/products")}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/shop/products/edit/${product.id}`)}
        >
          Chỉnh sửa
        </Button>
      </Space>

      <Title level={2} style={{ marginBottom: "20px" }}>
        Chi tiết sản phẩm
      </Title>

      <Card style={{ marginBottom: "20px" }}>
        <Descriptions title="Thông tin cơ bản" bordered>
          <Descriptions.Item label="Tên sản phẩm" span={3}>
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục" span={3}>
            {product.categoryName}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={3}>
            {product.description || "Không có mô tả"}
          </Descriptions.Item>
          <Descriptions.Item label="Lượt mua" span={3}>
            {product.buyTurn || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Thumbnail" span={3}>
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt="Product Thumbnail"
                width={200}
                preview={false}
              />
            ) : (
              "Không có ảnh"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <Descriptions title="Thông tin bán hàng" bordered>
          <Descriptions.Item label="Giá" span={3}>
            {product.price.toLocaleString()} ₫
          </Descriptions.Item>
          <Descriptions.Item label="Tồn kho" span={3}>
            {product.quantityInStock}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {product.variations && product.variations.length > 0 && (
        <Card title="Phân loại sản phẩm">
          <Table
            columns={columns}
            dataSource={productItems}
            pagination={false}
            bordered
          />
        </Card>
      )}
    </div>
  );
}
