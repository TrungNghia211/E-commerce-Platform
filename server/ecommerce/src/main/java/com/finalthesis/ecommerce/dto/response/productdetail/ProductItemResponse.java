package com.finalthesis.ecommerce.dto.response.productdetail;

import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItemResponse {
    Integer id;

    Integer quantityInStock;

    Double price;

    String thumbnail;

    Set<VariationOptionResponse> variationOptions;
}
