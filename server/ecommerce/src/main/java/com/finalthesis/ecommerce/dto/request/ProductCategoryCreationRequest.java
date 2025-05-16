package com.finalthesis.ecommerce.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCategoryCreationRequest {
    String name;

    String slug;

    MultipartFile thumbnail;

    boolean visible;

    Integer parentCategoryId;
}
