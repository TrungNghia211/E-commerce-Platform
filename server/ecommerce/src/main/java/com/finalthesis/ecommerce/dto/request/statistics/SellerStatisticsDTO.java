package com.finalthesis.ecommerce.dto.request.statistics;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SellerStatisticsDTO {
    Long totalOrders;

    BigDecimal totalRevenue;

    BigDecimal totalSellerEarnings;

    BigDecimal totalPlatformFee;

    Long totalProducts;

    Long totalProductsSold;

    List<MonthlyRevenueDTO> monthlyRevenue;

    List<ProductStatsDTO> topProducts;

    List<OrderStatusCountDTO> orderStatusStats;
}
