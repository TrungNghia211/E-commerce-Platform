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
public class ProductItemRequest {
    String sku;

    Integer quantityInStock;

    Double price;

    MultipartFile thumbnailFiles;

    List<String> variationOptionValues;
}
