package com.finalthesis.ecommerce.dto.response.customerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VariationOptionDTO {
    Integer id;
    String value;
    String variationName;
}
