package com.finalthesis.ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Integer id;

    String name;

    String slug;

    String description;

    Integer quantityInStock; // Total quantity from product items

    Double price; // Base price from product

    Integer buyTurn;

    Double weight;

    Integer length;

    Integer width;

    Integer height;

    String thumbnail;

    Integer purchaseCount;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
