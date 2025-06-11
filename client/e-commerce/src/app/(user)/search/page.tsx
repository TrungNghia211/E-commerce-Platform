"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Slider, Radio, Space, Spin } from "antd";
import classNames from "classnames/bind";

import styles from "./SearchPage.module.scss";
import ItemCard from "../../components/ItemCard/ItemCard";
import productApiRequest from "@/apiRequests/product";
import { HomepageProductResponse } from "@/types/product";

const cx = classNames.bind(styles);

type SortOption = "price_asc" | "price_desc" | "buyTurn_desc";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState<HomepageProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<SortOption>("buyTurn_desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword) return;
      setLoading(true);
      try {
        const response = await productApiRequest.searchProducts(keyword, page);
        const newProducts = response.payload.result.content;
        setProducts((prev) =>
          page === 1 ? newProducts : [...prev, ...newProducts]
        );
        setHasMore(newProducts.length === response.payload.result.size);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, page]);

  const filteredProducts = products
    .filter((product) => {
      const price = product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "buyTurn_desc":
          return (b.buyTurn || 0) - (a.buyTurn || 0);
        default:
          return 0;
      }
    });

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("filters")}>
        <div className={cx("filterSection")}>
          <h3 className={cx("filterTitle")}>Khoảng giá</h3>
          <Slider
            range
            min={0}
            max={10000000}
            step={100000}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            tooltip={{
              formatter: (value) => formatPrice(value || 0),
            }}
          />
          <div className={cx("priceRange")}>
            <span>{formatPrice(priceRange[0])}đ</span>
            <span>{formatPrice(priceRange[1])}đ</span>
          </div>
        </div>

        <div className={cx("filterSection")}>
          <h3 className={cx("filterTitle")}>Sắp xếp theo</h3>
          <Radio.Group
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="buyTurn_desc">Bán chạy nhất</Radio>
              <Radio value="price_asc">Giá tăng dần</Radio>
              <Radio value="price_desc">Giá giảm dần</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>

      <div className={cx("results")}>
        <h1 className={cx("searchTitle")}>
          Kết quả tìm kiếm cho &ldquo;{keyword}&rdquo; (
          {filteredProducts.length} sản phẩm)
        </h1>

        {loading && page === 1 ? (
          <div className={cx("loading")}>
            <Spin size="large" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className={cx("productGrid")}>
              {filteredProducts.map((product, index) => (
                <ItemCard key={index} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className={cx("loadMore")}>
                <button
                  className={cx("loadMoreBtn")}
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={cx("noResults")}>
            Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm
          </div>
        )}
      </div>
    </div>
  );
}
