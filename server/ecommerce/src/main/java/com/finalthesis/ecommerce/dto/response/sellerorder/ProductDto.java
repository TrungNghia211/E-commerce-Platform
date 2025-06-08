package com.finalthesis.ecommerce.dto.response.sellerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDto {
    private Integer id;

    private String name;

    private String slug;

    private String thumbnail;

    private String description;

    private ProductCategoryDto category;
}
