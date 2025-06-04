package com.finalthesis.ecommerce.dto.request.payment;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    String customerName;

    String customerPhone;

    String customerEmail;

    String shippingAddress;

    String paymentMethod; // "VNPAY" or "COD"

    Integer productItemId;

    Integer quantity;

    BigDecimal totalPrice;

    String ipAddress;
}
