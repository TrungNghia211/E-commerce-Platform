"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  UploadChangeParam,
  RcFile,
  UploadFile,
} from "antd/lib/upload/interface";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import { HttpError } from "@/lib/http";
import {
  FormVariation,
  ProductCreationRequestPayload,
  ProductFormValues,
} from "@/types/product/types";

import productApiRequest from "@/apiRequests/product";
import productCategoryApiRequest from "@/apiRequests/productCategory";

const { TextArea } = Input;
const { Title } = Typography;

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

interface TreeNode {
  title: string | number | React.ReactNode;
  value: string;
  key: string;
  children?: TreeNode[];
}

interface VariationOption {
  id: number;
  value: string;
}

interface Variation {
  id: number;
  name: string;
  variationOptions: VariationOption[];
}

interface ProductItemResponse {
  id: number;
  quantityInStock: number;
  price: number;
  thumbnail: string | null;
  variationOptions: {
    id: number;
    value: string;
  }[];
}

interface ProductResponse {
  id: number;
  name: string;
  quantityInStock: number;
  price: number;
  description: string;
  thumbnail: string;
  categoryName: string;
  variations: Variation[];
  productItems: ProductItemResponse[];
}

interface ProductItemData {
  id: number;
  sku: string;
  price: number;
  quantityInStock: number;
  thumbnail: { url: string; status?: string }[];
  variationOptions: { name: string; value: string }[];
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [form] = Form.useForm();
  const [hasVariations, setHasVariations] = useState(false);
  const [productItems, setProductItems] = useState<ProductItemData[]>([]);
  const [categories, setCategories] = useState<TreeNode[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productTableColumns, setProductTableColumns] = useState<
    ColumnsType<ProductItemData>
  >([]);

  // Fetch product details and categories
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          productApiRequest.getSellerProductDetail(parseInt(resolvedParams.id)),
          productCategoryApiRequest.getAllCategories(),
        ]);

        if (!isMounted) return;

        if (
          productResponse.payload.code === 1000 &&
          productResponse.payload.result
        ) {
          const product = productResponse.payload.result;

          // Set form values with all available information
          form.setFieldsValue({
            name: product.name,
            slug: product.name.toLowerCase().replace(/\s+/g, "-"),
            categoryId: undefined, // Will be set after finding category ID
            description: product.description,
            weight: 0, // These values are not in the API response
            length: 0, // These values are not in the API response
            width: 0, // These values are not in the API response
            height: 0, // These values are not in the API response
            price: product.price,
            quantityInStock: product.quantityInStock,
            thumbnail: product.thumbnail
              ? [
                  {
                    uid: "-1",
                    name: product.thumbnail.split("/").pop() || "thumbnail",
                    status: "done",
                    url: product.thumbnail,
                  },
                ]
              : [],
          });

          // Set variations if exists
          if (
            product.variations &&
            product.variations.length > 0 &&
            isMounted
          ) {
            setHasVariations(true);
            const variations = product.variations.map((v: Variation) => ({
              name: v.name,
              options: v.variationOptions.map(
                (opt: VariationOption) => opt.value
              ),
            }));
            form.setFieldValue("variations", variations);
          }

          // Set product items if exists
          if (
            product.productItems &&
            product.productItems.length > 0 &&
            isMounted
          ) {
            const items = product.productItems.map(
              (item: ProductItemResponse) => {
                // Create thumbnail object for Upload component
                const thumbnailFile = item.thumbnail
                  ? {
                      uid: item.id.toString(),
                      name: item.thumbnail.split("/").pop() || "thumbnail",
                      status: "done" as const,
                      url: item.thumbnail,
                    }
                  : null;

                return {
                  id: item.id,
                  sku: "", // SKU is not in the API response
                  price: item.price,
                  quantityInStock: item.quantityInStock,
                  thumbnail: thumbnailFile ? [thumbnailFile] : [],
                  variationOptions: item.variationOptions.map((opt) => {
                    // Find the variation name for this option
                    const variation = product.variations.find((v) =>
                      v.variationOptions.some((vo) => vo.id === opt.id)
                    );
                    return {
                      name: variation?.name || "",
                      value: opt.value,
                    };
                  }),
                };
              }
            );
            setProductItems(items);
          }

          // Find and set category ID
          if (
            categoriesResponse.payload.code === 1000 &&
            Array.isArray(categoriesResponse.payload.result)
          ) {
            const findCategoryId = (
              categories: Category[],
              name: string
            ): string | undefined => {
              for (const category of categories) {
                if (category.name === name) {
                  return category.id.toString();
                }
                if (
                  category.subCategories &&
                  category.subCategories.length > 0
                ) {
                  const found = findCategoryId(category.subCategories, name);
                  if (found) return found;
                }
              }
              return undefined;
            };

            const categoryId = findCategoryId(
              categoriesResponse.payload.result,
              product.categoryName
            );
            if (categoryId && isMounted) {
              form.setFieldValue("categoryId", categoryId);
            }
          }
        }

        if (
          categoriesResponse.payload.code === 1000 &&
          Array.isArray(categoriesResponse.payload.result) &&
          isMounted
        ) {
          const treeData = transformCategoriesToTreeData(
            categoriesResponse.payload.result
          );
          setCategories(treeData);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Error loading product data:", error);
        let errorMessage = "Failed to load product data";
        if (error instanceof HttpError) {
          errorMessage = error.payload?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        message.error(errorMessage);
        router.push("/shop/products");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [resolvedParams.id, form, router]);

  // Helper functions (reused from add product page)
  const transformCategoriesToTreeData = (data: Category[]): TreeNode[] => {
    return data
      .filter((category) => category.visible)
      .map((category) => ({
        value: String(category.id),
        title: category.name,
        key: String(category.id),
        children:
          category.subCategories && category.subCategories.length > 0
            ? transformCategoriesToTreeData(category.subCategories)
            : undefined,
      }));
  };

  const generateItemId = useCallback(
    (variationOptions: { name: string; value: string }[]) => {
      return parseInt(
        variationOptions
          .map((opt) => `${opt.name}:${opt.value}`)
          .sort()
          .join("|")
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
          .toString()
          .slice(0, 9)
      );
    },
    []
  );

  const updateProductItem = useCallback(
    (itemId: number, field: string, value: number | string | UploadFile[]) => {
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

      const validVariations = variations.filter(
        (v) => v && v.name && Array.isArray(v.options) && v.options.length > 0
      );

      if (validVariations.length === 0) {
        setProductItems([]);
        setProductTableColumns([]);
        return;
      }

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
      const newProductItems: ProductItemData[] = combinations.map(
        (combination) => {
          const itemId = generateItemId(combination);
          const existingItem = productItems.find((item) => item.id === itemId);

          return {
            id: itemId,
            variationOptions: combination,
            sku: existingItem?.sku || "",
            price: existingItem?.price || 0,
            quantityInStock: existingItem?.quantityInStock || 0,
            thumbnail: existingItem?.thumbnail || [],
          };
        }
      );

      setProductItems(newProductItems);

      // Generate table columns
      const dynamicColumns: ColumnsType<ProductItemData> = [];

      validVariations.forEach((variation) => {
        dynamicColumns.push({
          title: variation.name,
          key: `variation_${variation.name}`,
          width: 120,
          render: (_: unknown, record: ProductItemData) => {
            const option = record.variationOptions.find(
              (opt) => opt.name === variation.name
            );
            return option ? <span>{option.value}</span> : null;
          },
        });
      });

      dynamicColumns.push(
        {
          title: "Ảnh sản phẩm",
          key: "thumbnail",
          width: 100,
          render: (_: unknown, record: ProductItemData) => (
            <Upload
              name="thumbnail"
              listType="picture-card"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              fileList={record.thumbnail}
              onChange={(info) => {
                updateProductItem(record.id, "thumbnail", info.fileList);
              }}
              beforeUpload={() => false}
            >
              {(!record.thumbnail || record.thumbnail.length === 0) && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          ),
        },
        {
          title: <>* Giá</>,
          dataIndex: "price",
          key: "price",
          width: 120,
          render: (_: unknown, record: ProductItemData) => (
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              value={record.price || 0}
              formatter={(value) =>
                `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => {
                const parsed = value!.replace(/\$\s?|(,*)/g, "");
                return parsed ? parseInt(parsed, 10) : 0;
              }}
              onChange={(value) => {
                updateProductItem(record.id, "price", value || 0);
              }}
            />
          ),
        },
        {
          title: <>* Kho hàng</>,
          dataIndex: "quantityInStock",
          key: "quantityInStock",
          width: 120,
          render: (_: unknown, record: ProductItemData) => (
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              value={record.quantityInStock}
              onChange={(value) => {
                updateProductItem(record.id, "quantityInStock", value || 0);
              }}
            />
          ),
        },
        {
          title: "SKU phân loại",
          dataIndex: "sku",
          key: "sku",
          width: 120,
          render: (_: unknown, record: ProductItemData) => (
            <Input
              value={record.sku}
              onChange={(e) => {
                updateProductItem(record.id, "sku", e.target.value);
              }}
            />
          ),
        }
      );

      setProductTableColumns(dynamicColumns);
    },
    [productItems, updateProductItem]
  );

  const variations = Form.useWatch<FormVariation[]>("variations", form);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (variations) {
      timeoutId = setTimeout(() => {
        generateProductData(variations);
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [variations, generateProductData]);

  // const onFinish = async (values: ProductFormValues) => {
  //   setSubmitting(true);

  //   try {
  //     if (!values.categoryId) {
  //       message.error("Vui lòng chọn ngành hàng!");
  //       setSubmitting(false);
  //       return;
  //     }

  //     if (hasVariations && productItems.length > 0) {
  //       const invalidItems = productItems.filter(
  //         (item) =>
  //           item.price === undefined ||
  //           item.price === null ||
  //           item.price <= 0 ||
  //           item.quantityInStock < 0
  //       );

  //       if (invalidItems.length > 0) {
  //         message.error(
  //           "Vui lòng nhập đầy đủ thông tin giá và số lượng cho tất cả phân loại!"
  //         );
  //         setSubmitting(false);
  //         return;
  //       }

  //       productItems.forEach((item) => {
  //         if (typeof item.price !== "number") {
  //           item.price = 0;
  //         }
  //       });
  //     }

  //     const formData = new FormData();
  //     const productPayload: ProductCreationRequestPayload = {
  //       name: values.name,
  //       slug: values.slug,
  //       categoryId: parseInt(values.categoryId, 10),
  //       description: values.description,
  //       weight: values.weight,
  //       length: values.length,
  //       width: values.width,
  //       height: values.height,
  //       price: values.price,
  //     };

  //     const productItemFiles: (File | null)[] = [];

  //     if (hasVariations) {
  //       if (values.variations) {
  //         productPayload.variations = values.variations.map((v) => ({
  //           name: v.name,
  //           options: v.options.map((optValue) => ({ value: optValue })),
  //         }));
  //       }

  //       if (productItems && productItems.length > 0) {
  //         productPayload.productItems = productItems.map((item) => {
  //           const thumbnailFile = item.thumbnail?.[0];
  //           if (thumbnailFile) {
  //             if ("url" in thumbnailFile) {
  //               productItemFiles.push(null);
  //             } else if (
  //               thumbnailFile &&
  //               typeof thumbnailFile === "object" &&
  //               "originFileObj" in thumbnailFile
  //             ) {
  //               productItemFiles.push(thumbnailFile.originFileObj as RcFile);
  //             } else {
  //               productItemFiles.push(null);
  //             }
  //           } else {
  //             productItemFiles.push(null);
  //           }

  //           const price = typeof item.price === "number" ? item.price : 0;

  //           return {
  //             sku: item.sku || "",
  //             quantityInStock: item.quantityInStock || 0,
  //             price: price,
  //             variationOptionValues: item.variationOptions.map(
  //               (opt) => opt.value
  //             ),
  //           };
  //         });
  //       }
  //     } else {
  //       productPayload.sku = values.sku;
  //       productPayload.price = values.price || 0;
  //       productPayload.quantityInStock = values.quantityInStock || 0;
  //     }

  //     const productBlob = new Blob([JSON.stringify(productPayload)], {
  //       type: "application/json",
  //     });
  //     formData.append("product", productBlob);

  //     if (
  //       values.thumbnail &&
  //       values.thumbnail.length > 0 &&
  //       values.thumbnail[0].originFileObj
  //     ) {
  //       formData.append(
  //         "thumbnail",
  //         values.thumbnail[0].originFileObj as RcFile
  //       );
  //     }

  //     if (hasVariations && productItemFiles.length > 0) {
  //       productItemFiles.forEach((file) => {
  //         if (file) {
  //           formData.append("thumbnailFiles", file);
  //         }
  //       });
  //     }

  //     await productApiRequest.updateProduct(
  //       parseInt(resolvedParams.id),
  //       formData
  //     );
  //     message.success("Cập nhật sản phẩm thành công!");
  //     router.push("/shop/products");
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An unknown error occurred.";
  //     let apiErrorMessage = errorMessage;
  //     if (error instanceof HttpError && error.payload?.message) {
  //       apiErrorMessage = error.payload.message;
  //     }
  //     message.error(`Cập nhật sản phẩm thất bại: ${apiErrorMessage}`);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const onFinish = async (values: ProductFormValues) => {
    setSubmitting(true);

    try {
      if (!values.categoryId) {
        message.error("Vui lòng chọn ngành hàng!");
        setSubmitting(false);
        return;
      }

      // Validation for products with variations
      if (hasVariations) {
        if (!values.variations || values.variations.length === 0) {
          message.error("Vui lòng thêm ít nhất một phân loại!");
          setSubmitting(false);
          return;
        }

        if (productItems.length === 0) {
          message.error("Không có sản phẩm phân loại nào được tạo!");
          setSubmitting(false);
          return;
        }

        const invalidItems = productItems.filter(
          (item) =>
            item.price === undefined ||
            item.price === null ||
            item.price <= 0 ||
            item.quantityInStock < 0
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

      // Prepare product payload
      const productPayload: ProductCreationRequestPayload = {
        name: values.name,
        slug: values.slug,
        categoryId: parseInt(values.categoryId, 10),
        description: values.description,
        weight: values.weight || 0,
        length: values.length || 0,
        width: values.width || 0,
        height: values.height || 0,
        price: values.price || 0,
      };

      // Handle variations
      if (hasVariations && values.variations) {
        productPayload.variations = values.variations.map((v) => ({
          name: v.name,
          options: v.options.map((optValue) => ({ value: optValue })),
        }));

        // Handle product items for variations
        if (productItems && productItems.length > 0) {
          productPayload.productItems = productItems.map((item) => ({
            sku: item.sku || "",
            quantityInStock: item.quantityInStock || 0,
            price: typeof item.price === "number" ? item.price : 0,
            variationOptionValues: item.variationOptions.map(
              (opt) => opt.value
            ),
          }));
        }
      } else {
        // Handle single product without variations
        productPayload.sku = values.sku || "";
        productPayload.price = values.price || 0;
        productPayload.quantityInStock = values.quantityInStock || 0;
      }

      // Add product data to FormData
      const productBlob = new Blob([JSON.stringify(productPayload)], {
        type: "application/json",
      });
      formData.append("product", productBlob);

      // Handle main thumbnail - only add if it's a new file
      if (values.thumbnail && values.thumbnail.length > 0) {
        const thumbnailFile = values.thumbnail[0];
        // Check if it's a new file (has originFileObj) or existing file (has url)
        if (thumbnailFile.originFileObj) {
          formData.append("thumbnail", thumbnailFile.originFileObj as RcFile);
        }
        // If it's an existing file (only has url), don't append to FormData
      }

      // Handle product item thumbnails - only for variations
      if (hasVariations && productItems.length > 0) {
        const thumbnailFiles: (File | null)[] = [];

        productItems.forEach((item) => {
          const thumbnailFile = item.thumbnail?.[0];
          if (thumbnailFile && thumbnailFile.originFileObj) {
            // This is a new file
            thumbnailFiles.push(thumbnailFile.originFileObj as RcFile);
          } else {
            // This is either no file or existing file
            thumbnailFiles.push(null);
          }
        });

        // Only append non-null files
        thumbnailFiles.forEach((file) => {
          if (file) {
            formData.append("thumbnailFiles", file);
          }
        });
      }

      // Log FormData for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await productApiRequest.updateProduct(
        parseInt(resolvedParams.id),
        formData
      );

      message.success("Cập nhật sản phẩm thành công!");
      router.push("/shop/products");
    } catch (error) {
      console.error("Error updating product:", error);
      let errorMessage = "Cập nhật sản phẩm thất bại";

      if (error instanceof HttpError && error.payload?.message) {
        errorMessage = `Cập nhật sản phẩm thất bại: ${error.payload.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Cập nhật sản phẩm thất bại: ${error.message}`;
      }

      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

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

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: "10px", textAlign: "center" }}>
        Chỉnh Sửa Sản Phẩm
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          quantityInStock: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
        }}
      >
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: "20px" }}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập slug sản phẩm!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Ngành hàng"
            rules={[{ required: true, message: "Vui lòng chọn ngành hàng!" }]}
          >
            <TreeSelect
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={categories}
              placeholder="Chọn ngành hàng"
              treeDefaultExpandAll
              allowClear
              filterTreeNode={(inputValue: string, treeNode: TreeNode) => {
                const title = String(treeNode.title || "");
                return title.toLowerCase().includes(inputValue.toLowerCase());
              }}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả sản phẩm">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="thumbnail"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click để upload</Button>
            </Upload>
          </Form.Item>
        </Card>

        {/* Sales Information */}
        <Card title="Thông tin bán hàng" style={{ marginBottom: "20px" }}>
          <Form.Item label="Sản phẩm có biến thể?" valuePropName="checked">
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

        {/* Shipping Information */}
        <Card title="Vận chuyển">
          <Form.Item
            name="weight"
            label="Cân nặng (Sau khi đóng gói) (gram)"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Title level={5}>Kích thước đóng gói (cm)</Title>
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="length"
              label="Chiều dài"
              rules={[{ required: true, message: "Vui lòng nhập chiều dài!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="width"
              label="Chiều rộng"
              rules={[{ required: true, message: "Vui lòng nhập chiều rộng!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="height"
              label="Chiều cao"
              rules={[{ required: true, message: "Vui lòng nhập chiều cao!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>
        </Card>

        <Form.Item style={{ marginTop: "10px" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
            >
              Cập nhật sản phẩm
            </Button>
            <Button onClick={() => router.push("/shop/products")}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
