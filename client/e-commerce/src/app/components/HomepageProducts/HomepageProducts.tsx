"use client";

import { Button } from "antd";
import { useState } from "react";

import productApiRequest from "@/apiRequests/product";
import ItemCard from "@/app/components/ItemCard/ItemCard";

export default function HomepageProducts({
  homepageProducts,
  totalPages,
}: {
  homepageProducts: any[];
  totalPages: number;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>(homepageProducts);

  const loadProducts = async (pageNumber: number) => {
    const res = await productApiRequest.getHomepageProducts(pageNumber);
    setProducts((prevProducts: any) => [
      ...prevProducts,
      ...res.payload.result.content,
    ]);
  };

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
      loadProducts(currentPage);
    }
  };

  return (
    <>
      <p className="flex justify-center text-[30px] font-semibold">
        Gợi ý cho bạn
      </p>

      <div className="mb-[20px]">
        <div className="mt-2 grid grid-cols-6 gap-x-2 gap-y-2">
          {products.map((product: any) => (
            <ItemCard key={product.id} props={product} />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {currentPage < totalPages && (
          <Button className="w-[385px] mt-[50px]" onClick={handleViewMore}>
            Xem thêm
          </Button>
        )}
      </div>
    </>
  );
}
