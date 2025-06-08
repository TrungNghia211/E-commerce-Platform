package com.finalthesis.ecommerce.dto.response.sellerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VariationDto {
    Integer id;
    String name;
}
