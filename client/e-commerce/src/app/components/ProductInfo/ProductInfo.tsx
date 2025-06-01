"use client";

import { Button, Typography } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import { useState, useCallback, useMemo } from "react";

import styles from "./ProductInfo.module.scss";
import { ProductDetailType } from "@/types/product/types";

const cx = classNames.bind(styles);

function ProductInfo({ product }: { product: ProductDetailType }) {
  const [selectedVariations, setSelectedVariations] = useState<{
    [key: number]: number;
  }>({});

  // Memoize selected product item để tránh tính toán lại không cần thiết
  const selectedItem = useMemo(() => {
    if (Object.keys(selectedVariations).length === 0) {
      return product.productItems[0];
    }

    return (
      product.productItems.find((item) => {
        return item.variationOptions.every((option) => {
          const variation = product.variations.find((v) =>
            v.variationOptions.some((vo) => vo.id === option.id)
          );
          return selectedVariations[variation?.id || 0] === option.id;
        });
      }) || product.productItems[0]
    );
  }, [selectedVariations, product.productItems, product.variations]);

  // Callback để tối ưu performance khi click
  const handleVariantSelect = useCallback(
    (item: (typeof product.productItems)[0]) => {
      const newSelections: { [key: number]: number } = {};

      item.variationOptions.forEach((option) => {
        const variation = product.variations.find((v) =>
          v.variationOptions.some((vo) => vo.id === option.id)
        );
        if (variation) {
          newSelections[variation.id] = option.id;
        }
      });

      setSelectedVariations(newSelections);
    },
    [product.variations]
  );

  // Check if an item is selected
  const isItemSelected = useCallback(
    (item: (typeof product.productItems)[0], index: number) => {
      if (Object.keys(selectedVariations).length === 0) {
        return index === 0;
      }

      return item.variationOptions.every((option) => {
        const variation = product.variations.find((v) =>
          v.variationOptions.some((vo) => vo.id === option.id)
        );
        return selectedVariations[variation?.id || 0] === option.id;
      });
    },
    [selectedVariations, product.variations]
  );

  const hasVariations = product.variations && product.variations.length > 0;

  return (
    <div className={cx("container")}>
      <Typography.Title level={3} className={cx("product-name")}>
        {product.name}
      </Typography.Title>

      <div className={cx("rating-sold")}>
        <div className={cx("rating")}>{product.buyTurn || 0} đã bán</div>
      </div>

      <div className={cx("product-price")}>
        <Typography.Text className={cx("current-price")}>
          ₫{selectedItem.price.toLocaleString("vi-VN")}
        </Typography.Text>
      </div>

      {hasVariations && (
        <div className={cx("product-variants")}>
          <span>Phân loại:</span>
          <div className={cx("variant-options-list")}>
            {product.productItems.map((item, index) => (
              <div
                key={item.id}
                className={cx("variant-card", {
                  selected: isItemSelected(item, index),
                })}
                onClick={() => handleVariantSelect(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleVariantSelect(item);
                  }
                }}
              >
                <div className={cx("variant-details")}>
                  {item.variationOptions.map((option) => {
                    const variation = product.variations.find((v) =>
                      v.variationOptions.some((vo) => vo.id === option.id)
                    );
                    return (
                      <div
                        key={option.id}
                        className={cx("variant-option-detail")}
                      >
                        <span className={cx("option-label")}>
                          {variation?.name}:
                        </span>
                        <span className={cx("option-value")}>
                          {option.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={cx("variant-stock-price")}>
                  <span className={cx("stock-info")}>
                    Còn lại: {item.quantityInStock}
                  </span>
                  <span className={cx("price-info")}>
                    ₫{item.price.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cx("product-actions")}>
        <Button
          size="large"
          className={cx("add-to-cart")}
          type="primary"
          icon={<ShoppingCartOutlined />}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button size="large" className={cx("buy-now")} icon={<HeartOutlined />}>
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
