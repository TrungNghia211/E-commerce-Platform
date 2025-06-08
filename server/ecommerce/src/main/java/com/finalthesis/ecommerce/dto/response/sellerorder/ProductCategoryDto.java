package com.finalthesis.ecommerce.dto.response.sellerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCategoryDto {
    Integer id;

    String name;

    String slug;
}
