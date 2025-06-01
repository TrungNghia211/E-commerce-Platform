package com.finalthesis.ecommerce.dto.response.productdetail;

import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VariationResponse {
    Integer id;

    String name;

    Set<VariationOptionResponse> variationOptions;
}
