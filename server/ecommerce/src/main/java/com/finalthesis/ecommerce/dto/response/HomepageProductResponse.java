package com.finalthesis.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomepageProductResponse {

    Integer id;

    String name;

    String thumbnail;

    Double price;

    Integer purchaseCount;

}
