package com.finalthesis.ecommerce.dto.response.productdetail;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VariationOptionResponse {
    Integer id;
    String value;
}
