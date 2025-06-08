package com.finalthesis.ecommerce.dto.response.sellerorder;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItemDetailDto {
    Integer id;

    String sku;

    Integer quantityInStock;

    Double price;

    String thumbnail;

    ProductDto product;

    List<VariationOptionDto> variationOptions;
}
