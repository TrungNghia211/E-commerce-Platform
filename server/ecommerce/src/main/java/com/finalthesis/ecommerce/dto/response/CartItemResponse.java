package com.finalthesis.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    Integer cartId;

    Integer productItemId;

    Integer productId;

    String productName;

    String thumbnail;

    String variations;

    Double price;

    Integer quantity;

    Integer quantityInStock;

    String shopName;

    Integer shopId;

    Double totalPrice;
}
