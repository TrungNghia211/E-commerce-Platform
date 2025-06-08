package com.finalthesis.ecommerce.dto.response.customerorder;

import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.enums.PaymentMethod;
import com.finalthesis.ecommerce.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDTO {
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
    ProductItemDTO productItem;
    ShopDTO shop;
}
