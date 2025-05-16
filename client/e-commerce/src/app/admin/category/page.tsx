"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Image } from "antd";

import AddCategoryModal from "@/app/components/ProdcutCategoryModal/ProdcutCategoryModal";
import productCategoryApiRequest from "@/apiRequests/productCategory";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function ProductCategoryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Khi click "Tạo danh mục" (cha)
  const handleAddRootCategory = () => {
    setSelectedParentId(undefined); // Không truyền parentId
    setOpenModal(true);
  };

  // Khi click "Tạo danh mục con"
  const handleAddChildCategory = (parentId: string) => {
    setSelectedParentId(parentId); // Truyền id cha
    setOpenModal(true);
  };

  // Transform tree data và bổ sung parentId
  const transformCategories = (categories: any[], parentId?: string): any[] => {
    if (!categories) return [];
    return categories.map((cat) => {
      const children = cat.subCategories
        ? transformCategories(cat.subCategories, cat.id)
        : undefined;
      return {
        ...cat,
        parentId,
        ...(children && children.length > 0 ? { children } : {}), // chỉ set children nếu có con
      };
    });
  };

  // Fetch categories từ API và transform data
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await productCategoryApiRequest.getAllCategories();
      const transformed = transformCategories(res.payload.result);
      setCategories(transformed);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_: string, record: any) => {
        // Chỉ hiển thị thumbnail cho danh mục cha
        if (!record.parentId && record.thumbnail) {
          return (
            <Image
              src={record.thumbnail}
              width={50}
              height={50}
              alt="thumbnail"
            />
          );
        }
        return null;
      },
    },
    {
      title: "Hiển thị",
      dataIndex: "visible",
      key: "visible",
      render: (val: boolean) => (val ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Button onClick={() => handleAddChildCategory(record.id)}>
          Tạo danh mục con
        </Button>
      ),
    },
  ];

  return (
    <div className="p-[10px]">
      <Button
        type="primary"
        onClick={handleAddRootCategory}
        style={{ marginBottom: 16, width: 156 }}
      >
        Tạo danh mục
      </Button>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
        indentSize={30}
      />

      <AddCategoryModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedParentId(undefined);
          fetchCategories();
        }}
        parentId={selectedParentId}
      />
    </div>
  );
}
