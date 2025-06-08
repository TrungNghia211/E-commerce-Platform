package com.finalthesis.ecommerce.dto.response.customerorder;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItemDetailDTO {
    Integer id;
    String sku;
    Double price;
    String thumbnail;
    String productName;
    String productDescription;
    List<VariationOptionDTO> variationOptions;
}
