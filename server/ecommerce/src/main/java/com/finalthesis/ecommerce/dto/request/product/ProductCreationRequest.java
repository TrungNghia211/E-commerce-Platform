package com.finalthesis.ecommerce.dto.request.product;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    String name;
    String slug;
    Integer categoryId;
    String description;
    MultipartFile thumbnail;

    // For products without variations
    String sku;
    Double price;
    Integer quantityInStock;

    Double weight;
    Integer width;
    Integer length;
    Integer height;

    // If this Product has Variation
    List<VariationCreationRequest> variations;
    List<ProductItemRequest> productItems;
}
