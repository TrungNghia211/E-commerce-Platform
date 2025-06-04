package com.finalthesis.ecommerce.dto.request.payment;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentReturnResponse {
    boolean success;
    String message;
    String orderCode;
    BigDecimal totalPrice;
}
