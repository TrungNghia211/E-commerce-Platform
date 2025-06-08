package com.finalthesis.ecommerce.dto.response.sellerorder;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderStatisticsDto {
    Long totalOrders;

    Long pendingOrders;

    Long processingOrders;

    Long shippingOrders;

    Long deliveredOrders;

    Long cancelledOrders;

    BigDecimal totalRevenue;
}
