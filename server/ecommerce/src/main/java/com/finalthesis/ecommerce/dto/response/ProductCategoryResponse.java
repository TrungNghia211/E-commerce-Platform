package com.finalthesis.ecommerce.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCategoryResponse {
    Integer id;

    String name;

    String slug;

    String thumbnail;

    boolean visible;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Set<ProductCategoryResponse> subCategories;
}
