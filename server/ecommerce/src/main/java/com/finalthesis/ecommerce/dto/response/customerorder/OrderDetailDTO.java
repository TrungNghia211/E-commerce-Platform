package com.finalthesis.ecommerce.dto.response.customerorder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.enums.PaymentMethod;
import com.finalthesis.ecommerce.enums.PaymentStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailDTO {
    Integer id;
    String orderCode;
    String customerName;
    String customerPhone;
    String customerEmail;
    String shippingAddress;
    Integer quantity;
    BigDecimal totalAmount;
    OrderStatus status;
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    ProductItemDetailDTO productItem;
    ShopDTO shop;
}
