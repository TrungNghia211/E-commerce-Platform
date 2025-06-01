package com.finalthesis.ecommerce.dto.response.productdetail;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailResponse {
    Integer id;

    String name;

    Integer quantityInStock;

    Double price;

    Integer buyTurn;

    String description;

    String thumbnail;

    Integer purchaseCount;

    String categoryName;

    ShopResponse shop;

    List<ProductItemResponse> productItems;

    List<VariationResponse> variations;
}
