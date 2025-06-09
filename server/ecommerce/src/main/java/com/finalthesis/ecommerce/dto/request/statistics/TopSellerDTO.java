package com.finalthesis.ecommerce.dto.request.statistics;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopSellerDTO {
    Integer sellerId;

    String sellerName;

    BigDecimal totalRevenue;

    Long totalOrders;

    BigDecimal platformFee;
}
