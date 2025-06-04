"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, InputNumber, notification } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";

import styles from "./ProductInfo.module.scss";
import { ProductDetailType } from "@/types/product/types";

const cx = classNames.bind(styles);

function ProductInfo({ product }: { product: ProductDetailType }) {
  const [selectedVariations, setSelectedVariations] = useState<{
    [key: number]: number;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const router = useRouter();

  // Memoize selected product item để tránh tính toán lại không cần thiết
  const selectedItem = useMemo(() => {
    if (Object.keys(selectedVariations).length === 0)
      return product.productItems[0];

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
      if (Object.keys(selectedVariations).length === 0) return index === 0;

      return item.variationOptions.every((option) => {
        const variation = product.variations.find((v) =>
          v.variationOptions.some((vo) => vo.id === option.id)
        );
        return selectedVariations[variation?.id || 0] === option.id;
      });
    },
    [selectedVariations, product.variations]
  );

  // Validate quantity and stock
  const validateQuantityAndStock = () => {
    if (quantity <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn số lượng hợp lệ!",
      });
      return false;
    }

    if (quantity > selectedItem.quantityInStock) {
      notification.error({
        message: "Lỗi",
        description: "Số lượng vượt quá tồn kho!",
      });
      return false;
    }

    return true;
  };

  const hasVariations = product.variations && product.variations.length > 0;

  const handleBuyNow = () => {
    if (!validateQuantityAndStock()) return;
    setBuyNowLoading(true);

    // Tạo thông tin sản phẩm để checkout
    try {
      const checkoutItem = {
        productItemId: selectedItem.id,
        productName: product.name,
        thumbnail: selectedItem.thumbnail || product.thumbnail,
        variations: hasVariations
          ? selectedItem.variationOptions
              .map((option) => {
                const variation = product.variations.find((v) =>
                  v.variationOptions.some((vo) => vo.id === option.id)
                );
                return `${variation?.name}: ${option.value}`;
              })
              .join(", ")
          : "",
        price: selectedItem.price,
        quantity: quantity,
        total: selectedItem.price * quantity,
      };

      // Chuyển đến trang checkout
      const checkoutData = encodeURIComponent(JSON.stringify([checkoutItem]));
      router.push(`/products/checkout?items=${checkoutData}`);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể chuyển đến trang thanh toán!",
      });
    } finally {
      setBuyNowLoading(false);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!validateQuantityAndStock()) return;

    setAddToCartLoading(true);

    try {
      const cartItem = {
        productItemId: selectedItem.id,
        productName: product.name,
        thumbnail: selectedItem.thumbnail || product.thumbnail,
        variations: hasVariations
          ? selectedItem.variationOptions
              .map((option) => {
                const variation = product.variations.find((v) =>
                  v.variationOptions.some((vo) => vo.id === option.id)
                );
                return `${variation?.name}: ${option.value}`;
              })
              .join(", ")
          : "",
        price: selectedItem.price,
        quantity: quantity,
      };

      // Gọi API thêm vào giỏ hàng (nếu có)
      // await fetch('/api/cart/add', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cartItem)
      // });

      // Tạm thời lưu vào localStorage hoặc state management
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.productItemId === cartItem.productItemId
      );

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      notification.success({
        message: "Thành công",
        description: "Đã thêm sản phẩm vào giỏ hàng!",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng!",
      });
    } finally {
      setAddToCartLoading(false);
    }
  };

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

      <div className={cx("quantity-selector")} style={{ margin: "20px 0" }}>
        <span style={{ marginRight: "10px" }}>Số lượng:</span>
        <InputNumber
          min={1}
          max={selectedItem.quantityInStock}
          value={quantity}
          onChange={(value) => setQuantity(value || 1)}
          style={{ width: "120px" }}
        />
        <span style={{ marginLeft: "10px", color: "#999" }}>
          {selectedItem.quantityInStock} sản phẩm có sẵn
        </span>
      </div>

      <div className={cx("product-actions")}>
        <Button
          size="large"
          className={cx("add-to-cart")}
          type="default"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          loading={addToCartLoading}
        >
          Thêm vào giỏ hàng
        </Button>

        <Button
          size="large"
          className={cx("buy-now")}
          type="primary"
          icon={<HeartOutlined />}
          onClick={handleBuyNow}
          loading={buyNowLoading}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
