"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Switch, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

import productCategoryApiRequest from "@/apiRequests/productCategory";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  parentId?: string;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose,
  parentId,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

  const handleFinish = async (values: any) => {
    if (!parentId) {
      if (fileList.length === 0 || !fileList[0]?.originFileObj) {
        console.log("Vui lòng chọn ảnh đại diện");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("visible", values.visible ? "true" : "false");
    if (!parentId)
      formData.append("thumbnail", fileList[0].originFileObj as RcFile);
    if (parentId) formData.append("parentCategoryId", parentId);

    try {
      setLoading(true);
      await productCategoryApiRequest.createProductCategory(formData);
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error: any) {
      if (error.payload.code === 1010 || error.payload.code === 1011) {
        const code = error.payload.code;
        if (code === 1010) {
          form.setFields([
            {
              name: "name",
              errors: ["Tên danh mục đã tồn tại"],
            },
          ]);
        } else if (code === 1011) {
          form.setFields([
            {
              name: "slug",
              errors: ["Slug đã tồn tại"],
            },
          ]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={parentId ? "Thêm danh mục con" : "Thêm danh mục cha"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Tạo"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ visible: true }}
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
          <Switch />
        </Form.Item>

        {!parentId && (
          <Form.Item
            label="Ảnh đại diện"
            rules={[{ required: true, message: "Vui lòng Tải ảnh lên" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              )}
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
