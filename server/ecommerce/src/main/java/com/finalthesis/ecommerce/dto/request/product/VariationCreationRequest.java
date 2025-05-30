package com.finalthesis.ecommerce.dto.request.product;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VariationCreationRequest {
    String name;
    List<VariationOptionRequest> options;
}
