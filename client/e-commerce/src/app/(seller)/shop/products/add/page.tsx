"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Card,
  Space,
  Typography,
  Table,
  message,
  Switch,
  TreeSelect,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  UploadChangeParam,
  RcFile,
  UploadFile,
} from "antd/lib/upload/interface";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import { HttpError, clientSessionToken } from "@/lib/http";
import {
  FormVariation,
  ProductCreationRequestPayload,
  ProductFormValues,
  ProductItem,
} from "@/types/product/types";

import productCategoryApiRequest from "@/apiRequests/productCategory";

const { TextArea } = Input;
const { Title } = Typography;

// Define interface for category structure based on API response
interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  visible: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  subCategories: Category[];
}

// Define type for TreeSelect data nodes
interface TreeSelectNode {
  value: string;
  title: string;
  key: string;
  children?: TreeSelectNode[];
}

export default function AddProductPage() {
  const [form] = Form.useForm();
  const [hasVariations, setHasVariations] = useState(false);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  // Initialize categories as an empty array, will store tree data
  const [categories, setCategories] = useState<TreeSelectNode[]>([]); // Use TreeSelectNode[] type
  const [submitting, setSubmitting] = useState(false);
  const [productTableColumns, setProductTableColumns] = useState<
    ColumnsType<ProductItem>
  >([]);

  // Helper function to transform hierarchical categories to TreeSelect format (using TreeSelectNode type)
  const transformCategoriesToTreeData = (
    data: Category[]
  ): TreeSelectNode[] => {
    return data
      .filter((category) => category.visible)
      .map((category) => ({
        value: String(category.id), // TreeSelect expects string values
        title: category.name,
        key: String(category.id),
        children:
          category.subCategories && category.subCategories.length > 0
            ? transformCategoriesToTreeData(category.subCategories)
            : undefined,
      }));
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productCategoryApiRequest.getAllCategories();
        // Access code and result from response.payload
        if (
          response.payload.code === 1000 &&
          Array.isArray(response.payload.result)
        ) {
          // Use the new tree transformation function
          const treeData = transformCategoriesToTreeData(
            response.payload.result
          );
          setCategories(treeData); // Store the tree data in categories state
        } else {
          console.error(
            "Error fetching categories: Invalid response format",
            response
          );
          message.error("Failed to load categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Hàm tạo ID duy nhất cho product item dựa trên variation options
  const generateItemId = useCallback(
    (variationOptions: { name: string; value: string }[]) => {
      return variationOptions
        .map((opt) => `${opt.name}:${opt.value}`)
        .sort()
        .join("|");
    },
    []
  );

  // Hàm cập nhật product item - sử dụng useCallback để tránh re-render không cần thiết
  const updateProductItem = useCallback(
    (itemId: string, field: string, value: number | string | UploadFile[]) => {
      // Explicitly set type again
      setProductItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });
      });
    },
    []
  );

  // Function to generate Product Items and Table Columns based on variations
  const generateProductData = useCallback(
    (variations: FormVariation[] | undefined) => {
      if (
        !variations ||
        !Array.isArray(variations) ||
        variations.length === 0
      ) {
        setProductItems([]);
        setProductTableColumns([]);
        return;
      }

      // Filter out variations without name or options
      const validVariations = variations.filter(
        (v) => v && v.name && Array.isArray(v.options) && v.options.length > 0
      );

      if (validVariations.length === 0) {
        setProductItems([]);
        setProductTableColumns([]);
        return;
      }

      // --- Generate Product Items ---
      const generateCombinations = (
        index: number,
        currentCombination: { name: string; value: string }[]
      ): { name: string; value: string }[][] => {
        if (index === validVariations.length) {
          return [currentCombination];
        }

        const currentVariation = validVariations[index];
        const combinations: { name: string; value: string }[][] = [];

        if (currentVariation.options) {
          for (const optionValue of currentVariation.options) {
            if (
              optionValue !== undefined &&
              optionValue !== null &&
              optionValue.trim() !== ""
            ) {
              combinations.push(
                ...generateCombinations(index + 1, [
                  ...currentCombination,
                  { name: currentVariation.name, value: optionValue },
                ])
              );
            }
          }
        }

        return combinations;
      };

      const combinations = generateCombinations(0, []);

      // Create ProductItem objects from combinations
      const newProductItems: ProductItem[] = combinations.map((combination) => {
        const itemId = generateItemId(combination);

        // Tìm item hiện tại để giữ lại dữ liệu đã nhập
        const existingItem = productItems.find((item) => item.id === itemId);

        return {
          id: itemId,
          variationOptions: combination,
          sku: existingItem?.sku || "",
          price: existingItem?.price || 0,
          quantityInStock: existingItem?.quantityInStock || 0,
          thumbnail: existingItem?.thumbnail || [],
        };
      });

      setProductItems(newProductItems);

      // --- Generate Table Columns ---
      const dynamicColumns: ColumnsType<ProductItem> = [];

      // Add columns for each variation
      validVariations.forEach((variation, varIndex) => {
        dynamicColumns.push({
          title: variation.name,
          key: `variation_${varIndex}`,
          width: 120,
          render: (_: unknown, record: ProductItem) => {
            const option = record.variationOptions.find(
              (opt) => opt.name === variation.name
            );
            return option ? <span>{option.value}</span> : null;
          },
        });
      });

      // Add Thumbnail column
      dynamicColumns.push({
        title: "Ảnh sản phẩm",
        key: "thumbnail",
        width: 100,
        render: (_: unknown, record: ProductItem) => (
          <Upload
            name="thumbnail"
            listType="picture-card"
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
            fileList={record.thumbnail}
            onChange={(info) => {
              updateProductItem(record.id, "thumbnail", info.fileList);
            }}
            beforeUpload={() => false} // Prevent auto upload
          >
            {record.thumbnail && record.thumbnail.length > 0 ? null : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px dashed #d9d9d9",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlusOutlined style={{ fontSize: "16px" }} />
              </div>
            )}
          </Upload>
        ),
      });

      // Add Price column
      dynamicColumns.push({
        title: <>* Giá</>,
        dataIndex: "price",
        key: "price",
        width: 120,
        render: (text: number, record: ProductItem) => (
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="₫ Nhập vào"
            value={record.price}
            onChange={(value) => {
              updateProductItem(record.id, "price", value || 0);
            }}
          />
        ),
      });

      // Add Quantity column
      dynamicColumns.push({
        title: <>* Kho hàng</>,
        dataIndex: "quantityInStock",
        key: "quantityInStock",
        width: 120,
        render: (text: number, record: ProductItem) => (
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
            value={record.quantityInStock}
            onChange={(value) => {
              updateProductItem(record.id, "quantityInStock", value || 0);
            }}
          />
        ),
      });

      // Add SKU column
      dynamicColumns.push({
        title: "SKU phân loại",
        dataIndex: "sku",
        key: "sku",
        width: 120,
        render: (text: string, record: ProductItem) => (
          <Input
            placeholder="Nhập vào"
            value={record.sku}
            onChange={(e) => {
              updateProductItem(record.id, "sku", e.target.value);
            }}
          />
        ),
      });

      setProductTableColumns(dynamicColumns);
    },
    [productItems, updateProductItem]
  );

  // Watch for changes in variations and generate product items and columns
  const variations = Form.useWatch<FormVariation[]>("variations", form);

  useEffect(() => {
    // Thêm debounce để tránh call quá nhiều lần
    const timeoutId = setTimeout(() => {
      generateProductData(variations);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [variations, generateProductData]);

  const onFinish = async (values: ProductFormValues) => {
    setSubmitting(true);

    try {
      // Validate product items if has variations
      if (hasVariations && productItems.length > 0) {
        const invalidItems = productItems.filter(
          (item) => !item.price || item.price <= 0 || item.quantityInStock < 0
        );

        if (invalidItems.length > 0) {
          message.error(
            "Vui lòng nhập đầy đủ thông tin giá và số lượng cho tất cả phân loại!"
          );
          setSubmitting(false);
          return;
        }
      }

      const formData = new FormData();

      // Construct the ProductCreationRequest payload object
      const productPayload: ProductCreationRequestPayload = {
        name: values.name,
        slug: values.slug,
        categoryId: parseInt(values.categoryId, 10),
        description: values.description,
        weight: values.weight,
        length: values.length,
        width: values.width,
        height: values.height,
        price: values.price,
      };

      const productItemFiles: (File | null)[] = [];

      if (hasVariations) {
        if (values.variations) {
          productPayload.variations = values.variations.map((v) => ({
            name: v.name,
            options: v.options.map((optValue) => ({ value: optValue })),
          }));
        }

        if (productItems && productItems.length > 0) {
          productPayload.productItems = productItems.map((item) => {
            if (
              item.thumbnail &&
              item.thumbnail.length > 0 &&
              item.thumbnail[0].originFileObj
            ) {
              productItemFiles.push(item.thumbnail[0].originFileObj as RcFile);
            } else {
              productItemFiles.push(null);
            }

            return {
              sku: item.sku,
              quantityInStock: item.quantityInStock || 0,
              price: item.price || 0,
              variationOptionValues: item.variationOptions.map(
                (opt) => opt.value
              ),
            };
          });
        }
      } else {
        productPayload.sku = values.sku;
        productPayload.price = values.price;
        productPayload.quantityInStock = values.quantityInStock;
      }

      // Append data to FormData
      const productBlob = new Blob([JSON.stringify(productPayload)], {
        type: "application/json",
      });
      formData.append("product", productBlob);

      // Append main thumbnail
      if (
        values.thumbnail &&
        values.thumbnail.length > 0 &&
        values.thumbnail[0].originFileObj
      ) {
        formData.append(
          "thumbnail",
          values.thumbnail[0].originFileObj as RcFile
        );
      } else {
        formData.append("thumbnail", new Blob([]));
      }

      // Append product item thumbnails
      if (hasVariations && productItemFiles.length > 0) {
        productItemFiles.forEach((file) => {
          if (file) {
            formData.append("thumbnailFiles", file);
          } else {
            formData.append("thumbnailFiles", new Blob([]));
          }
        });
      } else if (hasVariations && productItems.length > 0) {
        productItems.forEach(() => {
          formData.append("thumbnailFiles", new Blob([]));
        });
      } else if (!hasVariations) {
        formData.append("thumbnailFiles", new Blob([]));
      }

      console.log("formData: ", formData);
      console.log("Kiểm tra FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch("http://localhost:8080/ecommerce/products", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${clientSessionToken.value}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new HttpError({ status: response.status, payload: errorData });
      }

      message.success("Thêm sản phẩm thành công!");

      // Reset form
      form.resetFields();
      setProductItems([]);
      setHasVariations(false);
    } catch (error: unknown) {
      console.error("Error adding product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      let apiErrorMessage = errorMessage;
      if (error instanceof HttpError && error.payload?.message) {
        apiErrorMessage = error.payload.message;
      }
      message.error(`Thêm sản phẩm thất bại: ${apiErrorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: "10px", textAlign: "center" }}>
        Thêm Sản Phẩm Mới
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          quantityInStock: 0,
          purchaseCount: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
        }}
      >
        {/* Thông tin cơ bản */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: "20px" }}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            style={{ marginBottom: 15 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập slug sản phẩm!" },
            ]}
            style={{ marginBottom: 15 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Ngành hàng"
            rules={[{ required: true, message: "Vui lòng chọn ngành hàng!" }]}
            style={{ marginBottom: 15 }}
          >
            <TreeSelect
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={categories} // Use the transformed tree data
              placeholder="Chọn ngành hàng"
              treeDefaultExpandAll
              allowClear
              filterTreeNode={(inputValue, treeNode) =>
                treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
            style={{ marginBottom: 15 }}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            style={{ marginBottom: 15 }}
          >
            <Upload name="thumbnail" listType="picture">
              <Button icon={<UploadOutlined />}>Click để upload</Button>
            </Upload>
          </Form.Item>
        </Card>

        {/* Thông tin bán hàng */}
        <Card title="Thông tin bán hàng" style={{ marginBottom: "20px" }}>
          <Form.Item
            label="Sản phẩm có biến thể?"
            valuePropName="checked"
            style={{ marginBottom: 15 }}
          >
            <Switch checked={hasVariations} onChange={setHasVariations} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {!hasVariations ? (
            <>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
                style={{ marginBottom: 15 }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="quantityInStock"
                label="Tồn kho"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng tồn kho!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </>
          ) : (
            <div>
              <Title level={5}>Phân loại hàng</Title>
              <Form.List name="variations">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Card
                        key={key}
                        size="small"
                        style={{ marginBottom: "20px", position: "relative" }}
                        title={
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing variation name",
                              },
                            ]}
                            style={{
                              marginBottom: 0,
                              display: "inline-block",
                              width: "calc(100% - 30px)",
                            }}
                          >
                            <Input placeholder={`Phân loại ${index + 1}`} />
                          </Form.Item>
                        }
                      >
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#999",
                          }}
                        />

                        <Form.Item label="Tùy chọn">
                          <Form.List name={[name, "options"]}>
                            {(
                              optionFields,
                              { add: addOption, remove: removeOption }
                            ) => (
                              <Space direction="vertical">
                                {optionFields.map(
                                  ({
                                    key: optionKey,
                                    name: optionName,
                                    ...optionRestField
                                  }) => (
                                    <Space key={optionKey} align="baseline">
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing option value",
                                          },
                                        ]}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <Input
                                          placeholder="Type or Select"
                                          style={{ width: "150px" }}
                                        />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => removeOption(optionName)}
                                        style={{ marginLeft: "8px" }}
                                      />
                                    </Space>
                                  )
                                )}
                                <Form.Item style={{ marginBottom: 0 }}>
                                  <Button
                                    type="dashed"
                                    onClick={() => addOption()}
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm tùy chọn
                                  </Button>
                                </Form.Item>
                              </Space>
                            )}
                          </Form.List>
                        </Form.Item>
                      </Card>
                    ))}
                    <Form.Item style={{ marginTop: "20px" }}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm nhóm phân loại khác
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Title
                level={5}
                style={{ marginTop: "30px", marginBottom: "15px" }}
              >
                Danh sách phân loại hàng
              </Title>

              {productItems.length > 0 && productTableColumns.length > 0 && (
                <Table
                  dataSource={productItems}
                  columns={productTableColumns}
                  rowKey="id"
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              )}
            </div>
          )}
        </Card>

        {/* Vận chuyển */}
        <Card title="Vận chuyển">
          <Form.Item
            name="weight"
            label="Cân nặng (Sau khi đóng gói) (gram)"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
            style={{ marginBottom: 15 }}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Title level={5}>Kích thước đóng gói (cm)</Title>
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              name="length"
              label="Chiều dài"
              rules={[{ required: true, message: "Vui lòng nhập chiều dài!" }]}
              // style={{ display: "inline-block", width: "100px" }}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="width"
              label="Chiều rộng"
              rules={[{ required: true, message: "Vui lòng nhập chiều rộng!" }]}
              // style={{ display: "inline-block", width: "100px" }}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="height"
              label="Chiều cao"
              rules={[{ required: true, message: "Vui lòng nhập chiều cao!" }]}
              // style={{ display: "inline-block", width: "100px" }}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>
        </Card>

        <Form.Item style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
          >
            Thêm Sản Phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
