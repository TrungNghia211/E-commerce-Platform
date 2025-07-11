package com.finalthesis.ecommerce.dto.response.customerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItemDTO {
    Integer id;
    String sku;
    Double price;
    String thumbnail;
    String productName;
}
