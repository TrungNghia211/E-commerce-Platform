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
public class AdminStatisticsDTO {
    Long totalOrders;

    BigDecimal totalRevenue;

    BigDecimal totalPlatformFee;

    Long totalUsers;

    Long totalSellers;

    Long totalProducts;

    List<MonthlyRevenueDTO> monthlyRevenue;

    List<TopSellerDTO> topSellers;

    List<OrderStatusCountDTO> orderStatusStats;

    List<CategoryStatsDTO> categoryStats;
}
