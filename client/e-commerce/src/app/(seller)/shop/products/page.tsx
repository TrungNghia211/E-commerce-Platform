// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Image,
//   Space,
//   Button,
//   Typography,
//   Pagination,
//   message,
//   Popconfirm,
//   Modal,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import productApiRequest from "@/apiRequests/product";

// const { Title } = Typography;

// interface ProductData {
//   id: number;
//   name: string;
//   slug: string;
//   thumbnail: string;
//   categoryName: string;
//   price: number;
//   quantity: number;
//   createdAt: string;
// }

// export default function ProductManagementPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<ProductData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [total, setTotal] = useState(0);
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//   const columns: ColumnsType<ProductData> = [
//     {
//       title: "Tên sản phẩm",
//       dataIndex: "name",
//       key: "name",
//       render: (text: string) => <a>{text}</a>,
//     },
//     {
//       title: "Hình ảnh",
//       dataIndex: "thumbnail",
//       key: "thumbnail",
//       render: (thumbnail: string) => (
//         <Image
//           src={thumbnail}
//           alt="Product thumbnail"
//           width={50}
//           height={50}
//           className="object-cover cursor-pointer"
//           onClick={() => {
//             setSelectedImage(thumbnail);
//             setIsPreviewOpen(true);
//           }}
//         />
//       ),
//     },
//     {
//       title: "Danh mục",
//       dataIndex: "categoryName",
//       key: "categoryName",
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Link href={`/shop/products/${record.id}`}>
//             <Button type="text" icon={<EyeOutlined />} />
//           </Link>
//           <Link href={`/shop/products/edit/${record.id}`}>
//             <Button type="text" icon={<EditOutlined />} />
//           </Link>
//           <Popconfirm
//             title="Xóa sản phẩm"
//             description="Bạn có chắc chắn muốn xóa sản phẩm này?"
//             onConfirm={() => handleDelete(record.id)}
//             okText="Xóa"
//             cancelText="Hủy"
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const fetchProducts = async (page: number, size: number) => {
//     setLoading(true);
//     try {
//       const response = await productApiRequest.getSellerProducts(
//         page - 1,
//         size
//       );
//       if (response.payload.code === 1000 && response.payload.result) {
//         setProducts(response.payload.result.content);
//         setTotal(response.payload.result.totalElements);
//       } else message.error("Failed to fetch products.");
//     } catch {
//       message.error("Failed to fetch products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   const handlePageChange = (page: number, size: number) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   const handleDelete = async (productId: number) => {
//     try {
//       await productApiRequest.deleteProduct(productId);
//       message.success("Xóa sản phẩm thành công");
//       fetchProducts(currentPage, pageSize);
//     } catch {
//       message.error("Xóa sản phẩm thất bại");
//     }
//   };

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px",
//         }}
//       >
//         <Title level={2}>Quản lý Sản phẩm</Title>
//         <Button
//           type="primary"
//           onClick={() => router.push("/shop/products/add")}
//         >
//           Thêm sản phẩm mới
//         </Button>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={products}
//         rowKey="id"
//         loading={loading}
//         pagination={false}
//       />

//       <Pagination
//         current={currentPage}
//         pageSize={pageSize}
//         total={total}
//         onChange={handlePageChange}
//         showSizeChanger
//         style={{
//           textAlign: "right",
//           marginTop: "10px",
//         }}
//       />

//       <Modal
//         open={isPreviewOpen}
//         footer={null}
//         onCancel={() => setIsPreviewOpen(false)}
//       >
//         {selectedImage && (
//           <Image
//             src={selectedImage}
//             alt="Selected Product"
//             style={{ width: "100%" }}
//           />
//         )}
//       </Modal>
//     </div>
//   );
// }

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
  Popconfirm,
  Modal,
  Input,
  Card,
  Row,
  Col,
  Tooltip,
  Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import productApiRequest from "@/apiRequests/product";

const { Title } = Typography;
const { Search } = Input;

interface ProductData {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  categoryName: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export default function ProductManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const columns: ColumnsType<ProductData> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="product-name">
          <Tooltip title={text}>
            <span className="product-name-text">{text}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 100,
      render: (thumbnail: string) => (
        <div className="thumbnail-container">
          <Image
            src={thumbnail}
            alt="Product thumbnail"
            width={60}
            height={60}
            className="product-thumbnail"
            onClick={() => {
              setSelectedImage(thumbnail);
              setIsPreviewOpen(true);
            }}
            preview={false}
          />
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (category: string) => (
        <Badge color="blue" text={category} className="category-badge" />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="price-text">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    // {
    //   title: "Số lượng",
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   render: (quantity: number) => (
    //     <Badge
    //       count={quantity}
    //       style={{
    //         backgroundColor: quantity > 0 ? "#52c41a" : "#ff4d4f",
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Link href={`/shop/products/${record.id}`}>
              <Button
                type="text"
                icon={<EyeOutlined />}
                className="action-btn view-btn"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link href={`/shop/products/edit/${record.id}`}>
              <Button
                type="text"
                icon={<EditOutlined />}
                className="action-btn edit-btn"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="action-btn delete-btn"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fetchProducts = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await productApiRequest.getSellerProducts(
        page - 1,
        size
      );
      if (response.payload.code === 1000 && response.payload.result) {
        setProducts(response.payload.result.content);
        setFilteredProducts(response.payload.result.content);
        setTotal(response.payload.result.totalElements);
      } else message.error("Failed to fetch products.");
    } catch {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleDelete = async (productId: number) => {
    try {
      await productApiRequest.deleteProduct(productId);
      message.success("Xóa sản phẩm thành công");
      fetchProducts(currentPage, pageSize);
    } catch {
      message.error("Xóa sản phẩm thất bại");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchProducts(currentPage, pageSize);
    message.success("Dữ liệu đã được làm mới");
  };

  return (
    <div className="product-management-container">
      <style jsx>{`
        .header-card {
          margin-bottom: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .main-title {
          margin: 0 !important;
          background: linear-gradient(45deg, #1890ff, #52c41a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }

        .search-container {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-input {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-input:focus,
        .search-input:hover {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .action-buttons-header {
          display: flex;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(45deg, #1890ff, #40a9ff);
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(45deg, #40a9ff, #1890ff);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
        }

        .btn-secondary {
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
        }

        .table-card {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .product-table :global(.ant-table) {
          border-radius: 12px;
        }

        .product-table :global(.ant-table-thead > tr > th) {
          background: linear-gradient(45deg, #f0f2f5, #e6f7ff);
          border-bottom: 2px solid #1890ff;
          font-weight: 600;
          color: #262626;
        }

        .product-table :global(.ant-table-tbody > tr:hover > td) {
          background: #f0f9ff !important;
        }

        .product-name-text {
          font-weight: 500;
          color: #262626;
          font-size: 14px;
        }

        .thumbnail-container {
          display: flex;
          justify-content: center;
        }

        .product-thumbnail {
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          object-fit: cover;
          border: 2px solid #f0f0f0;
        }

        .product-thumbnail:hover {
          transform: scale(1.1);
          border-color: #1890ff;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        }

        .category-badge :global(.ant-badge) {
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .price-text {
          font-weight: 600;
          color: #52c41a;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
        }

        .action-btn {
          border-radius: 6px;
          transition: all 0.3s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          background: #e6f7ff;
          color: #1890ff;
          transform: scale(1.1);
        }

        .edit-btn:hover {
          background: #fff7e6;
          color: #fa8c16;
          transform: scale(1.1);
        }

        .delete-btn:hover {
          background: #fff2f0;
          color: #ff4d4f;
          transform: scale(1.1);
        }

        .pagination-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stats-container {
          margin-bottom: 16px;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .stats-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .preview-modal :global(.ant-modal-content) {
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-modal :global(.ant-modal-body) {
          padding: 0;
        }

        @media (max-width: 768px) {
          .product-management-container {
            padding: 16px;
          }

          .search-container {
            flex-direction: column;
            align-items: stretch;
          }

          .action-buttons-header {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <Card className="header-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Title level={2} className="main-title">
              Quản lý Sản phẩm
            </Title>
          </Col>
          <Col xs={24} sm={24} md={16}>
            <div className="search-container">
              <Search
                placeholder="Tìm kiếm theo tên sản phẩm..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                style={{ flex: 1, minWidth: 250 }}
              />
              <div className="action-buttons-header">
                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    className="btn-secondary"
                    size="large"
                  />
                </Tooltip>
                {searchTerm && (
                  <Tooltip title="Xóa tìm kiếm">
                    <Button
                      icon={<ClearOutlined />}
                      onClick={handleClearSearch}
                      className="btn-secondary"
                      size="large"
                    />
                  </Tooltip>
                )}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/shop/products/add")}
                  className="btn-primary"
                  size="large"
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {(searchTerm || filteredProducts.length !== products.length) && (
        <div className="stats-container">
          <p className="stats-text">
            {searchTerm ? (
              <>
                Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm cho
                từ khóa "<strong>{searchTerm}</strong>" trong tổng số{" "}
                <strong>{products.length}</strong> sản phẩm
              </>
            ) : (
              <>
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </>
            )}
          </p>
        </div>
      )}

      <Card className="table-card">
        <Table
          className="product-table"
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={searchTerm ? filteredProducts.length : total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`
          }
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>

      <Modal
        open={isPreviewOpen}
        footer={null}
        onCancel={() => setIsPreviewOpen(false)}
        className="preview-modal"
        centered
        width="auto"
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Selected Product"
            style={{ width: "100%", maxWidth: 600 }}
            preview={false}
          />
        )}
      </Modal>
    </div>
  );
}
