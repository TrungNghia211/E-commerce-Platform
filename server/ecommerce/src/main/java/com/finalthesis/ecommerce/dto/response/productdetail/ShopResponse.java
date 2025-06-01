package com.finalthesis.ecommerce.dto.response.productdetail;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShopResponse {
    Integer id;
    String name;
    String avatar;
}
