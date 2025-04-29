// "use client";

import { useEffect, useState } from "react";
import { Button, Col, Pagination, Row } from "antd";
import ItemCard from "@/app/components/ItemCard/ItemCard";
import { useSearchParams, useRouter } from "next/navigation";
import productApiRequest from "@/apiRequests/product";

export default async function ProductsPage() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [totalPages, setTotalPages] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const currentPage = Number(searchParams.get('page')) || 0;

  // const loadProducts = async (page: number) => {
  //   try {
  //     setLoading(true);
  //     const response: PaginatedResponse<Product> = await ProductService.getProductsWithPagination(page);
  //     setProducts(response.content);
  //     setTotalPages(response.totalPages);
  //   } catch (error) {
  //     console.error('Error loading products:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadProducts(currentPage);
  // }, [currentPage]);

  // const handlePageChange = (page: number) => {
  //   router.push(`/products?page=${page - 1}`);
  // };

  const res = await productApiRequest.getHomepageProducts();

  return (
    <main className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f7fffe]">
      <div className="mt-[10px]">
        <p className="flex justify-center text-[30px] font-semibold">
          Tất cả sản phẩm
        </p>

        {/* <div className="mb-[20px]">
          <Row className="mt-[10px]" gutter={[8, 8]}>
            {products.map((product, index) => (
              <ItemCard key={index} props={product} />
            ))}
          </Row>
        </div> */}

        {/* <div className="flex justify-center mt-[50px]">
          <Pagination
            current={currentPage + 1}
            total={totalPages * 12}
            pageSize={12}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div> */}
      </div>
    </main>
  );
}
