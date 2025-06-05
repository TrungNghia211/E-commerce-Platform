"use client";

import { Button, Spin } from "antd";
import { useState, useEffect } from "react";

import recommendationApiRequest from "@/apiRequests/recommendation";
import ItemCard from "@/app/components/ItemCard/ItemCard";

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  buyTurn: number;
  description: string;
  quantityInStock: number;
}

interface RecommendedProductsProps {
  productId: number;
}

export default function RecommendedProducts({
  productId,
}: RecommendedProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sản phẩm trang đầu tiên
  useEffect(() => {
    loadInitialProducts();
  }, [productId]);

  const loadInitialProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recommendationApiRequest.getRecommendations(
        productId,
        1,
        6
      );

      if (res.payload.error) {
        setError(res.payload.error);
        return;
      }

      setProducts(res.payload.result.content);
      setTotalPages(res.payload.result.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading initial recommendations:", error);
      setError("Không thể tải sản phẩm gợi ý");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async (pageNumber: number) => {
    try {
      setLoadingMore(true);
      const res = await recommendationApiRequest.getRecommendations(
        productId,
        pageNumber,
        6
      );

      if (res.payload.error) {
        setError(res.payload.error);
        return;
      }

      setProducts((prevProducts) => [
        ...prevProducts,
        ...res.payload.result.content,
      ]);
    } catch (error) {
      console.error("Error loading more recommendations:", error);
      setError("Không thể tải thêm sản phẩm");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleViewMore = async () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await loadMoreProducts(nextPage);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#ffffff] mt-[10px] p-[15px]">
        <p className="text-[30px] font-semibold text-center">
          Sản phẩm liên quan
        </p>
        <div className="flex justify-center mt-[20px]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ffffff] mt-[10px] p-[15px]">
        <p className="text-[30px] font-semibold text-center">
          Sản phẩm liên quan
        </p>
        <div className="text-center mt-[20px] text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#ffffff] mt-[10px] p-[15px]">
        <p className="text-[30px] font-semibold text-center">
          Sản phẩm liên quan
        </p>
        <div className="text-center mt-[20px] text-gray-500">
          Không có sản phẩm liên quan
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] mt-[10px] p-[15px]">
      <p className="text-[30px] font-semibold text-center">
        Sản phẩm liên quan
      </p>

      <div className="mb-[20px]">
        <div className="mt-4 grid grid-cols-6 gap-x-2 gap-y-2">
          {products.map((product) => (
            <ItemCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {currentPage < totalPages && (
          <Button
            className="w-[385px] mt-[20px]"
            onClick={handleViewMore}
            loading={loadingMore}
          >
            {loadingMore ? "Đang tải..." : "Xem thêm"}
          </Button>
        )}
      </div>
    </div>
  );
}
