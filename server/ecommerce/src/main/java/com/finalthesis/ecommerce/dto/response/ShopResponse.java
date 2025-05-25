package com.finalthesis.ecommerce.dto.response;

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

    String phone;

    String bankName;
    String bankAccountNumber;
    String bankAccountHolderName;
}
