package com.finalthesis.ecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.finalthesis.ecommerce.dto.request.statistics.*;
import com.finalthesis.ecommerce.entity.Shop;
import com.finalthesis.ecommerce.repository.OrderRepository;
import com.finalthesis.ecommerce.repository.ProductRepository;
import com.finalthesis.ecommerce.repository.ShopRepository;
import com.finalthesis.ecommerce.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class StatisticsService {
    OrderRepository orderRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ShopRepository shopRepository;

    // Platform fee percentage (5%)
    static BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.05");

    public AdminStatisticsDTO getAdminStatistics(StatisticsFilterDTO filter) {
        LocalDateTime startDate = filter.getStartDate();
        LocalDateTime endDate = filter.getEndDate();

        // Get basic statistics
        Long totalOrders = orderRepository.countByCreatedAtBetween(startDate, endDate);
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(startDate, endDate);
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal totalPlatformFee = totalRevenue.multiply(PLATFORM_FEE_RATE);
        Long totalUsers = userRepository.countByCreatedAtBetween(startDate, endDate);
        Long totalSellers = userRepository.countSellersWithShop();
        Long totalProducts = productRepository.countByCreatedAtBetween(startDate, endDate);

        // Get monthly revenue
        List<MonthlyRevenueDTO> monthlyRevenue = getMonthlyRevenue(startDate, endDate, null);

        // Get top sellers
        List<TopSellerDTO> topSellers = getTopSellers(startDate, endDate, 10);

        // Get order status statistics
        List<OrderStatusCountDTO> orderStatusStats = getOrderStatusStatistics(startDate, endDate, null);

        // Get category statistics
        List<CategoryStatsDTO> categoryStats = getCategoryStatistics(startDate, endDate);

        return AdminStatisticsDTO.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalPlatformFee(totalPlatformFee)
                .totalUsers(totalUsers)
                .totalSellers(totalSellers)
                .totalProducts(totalProducts)
                .monthlyRevenue(monthlyRevenue)
                .topSellers(topSellers)
                .orderStatusStats(orderStatusStats)
                .categoryStats(categoryStats)
                .build();
    }

    public SellerStatisticsDTO getSellerStatistics(Integer sellerId, StatisticsFilterDTO filter) {
        LocalDateTime startDate = filter.getStartDate();
        LocalDateTime endDate = filter.getEndDate();

        // Get seller's shop
        Shop shop = shopRepository
                .findByUserId(sellerId)
                .orElseThrow(() -> new RuntimeException("Shop not found for seller"));

        // Get basic statistics
        Long totalOrders = orderRepository.countByShopIdAndCreatedAtBetween(shop.getId(), startDate, endDate);
        BigDecimal totalRevenue =
                orderRepository.sumTotalAmountByShopIdAndCreatedAtBetween(shop.getId(), startDate, endDate);
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal totalPlatformFee = totalRevenue.multiply(PLATFORM_FEE_RATE);
        BigDecimal totalSellerEarnings = totalRevenue.subtract(totalPlatformFee);
        Long totalProducts = productRepository.countByShopIdAndCreatedAtBetween(shop.getId(), startDate, endDate);
        Long totalProductsSold =
                orderRepository.countDistinctProductsByShopIdAndCreatedAtBetween(shop.getId(), startDate, endDate);

        // Get monthly revenue
        List<MonthlyRevenueDTO> monthlyRevenue = getMonthlyRevenue(startDate, endDate, shop.getId());

        // Get top products
        List<ProductStatsDTO> topProducts = getTopProductsForSeller(shop.getId(), startDate, endDate, 10);

        // Get order status statistics
        List<OrderStatusCountDTO> orderStatusStats = getOrderStatusStatistics(startDate, endDate, shop.getId());

        return SellerStatisticsDTO.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalSellerEarnings(totalSellerEarnings)
                .totalPlatformFee(totalPlatformFee)
                .totalProducts(totalProducts)
                .totalProductsSold(totalProductsSold)
                .monthlyRevenue(monthlyRevenue)
                .topProducts(topProducts)
                .orderStatusStats(orderStatusStats)
                .build();
    }

    private List<MonthlyRevenueDTO> getMonthlyRevenue(LocalDateTime startDate, LocalDateTime endDate, Integer shopId) {
        // This would be implemented with a native query or custom repository method
        // For brevity, I'll show the structure
        List<Object[]> results;
        if (shopId != null) {
            results = orderRepository.getMonthlyRevenueByShop(shopId, startDate, endDate);
        } else {
            results = orderRepository.getMonthlyRevenue(startDate, endDate);
        }

        return results.stream()
                .map(row -> {
                    String month = (String) row[0];
                    BigDecimal revenue = (BigDecimal) row[1];
                    Long orderCount = (Long) row[2];
                    BigDecimal platformFee = revenue.multiply(PLATFORM_FEE_RATE);
                    BigDecimal sellerEarnings = revenue.subtract(platformFee);

                    return MonthlyRevenueDTO.builder()
                            .month(month)
                            .revenue(revenue)
                            .platformFee(platformFee)
                            .sellerEarnings(sellerEarnings)
                            .orderCount(orderCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<TopSellerDTO> getTopSellers(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopSellers(startDate, endDate, limit);

        return results.stream()
                .map(row -> {
                    Integer sellerId = (Integer) row[0];
                    String sellerName = (String) row[1];
                    BigDecimal totalRevenue = (BigDecimal) row[2];
                    Long totalOrders = (Long) row[3];
                    BigDecimal platformFee = totalRevenue.multiply(PLATFORM_FEE_RATE);

                    return TopSellerDTO.builder()
                            .sellerId(sellerId)
                            .sellerName(sellerName)
                            .totalRevenue(totalRevenue)
                            .totalOrders(totalOrders)
                            .platformFee(platformFee)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<ProductStatsDTO> getTopProductsForSeller(
            Integer shopId, LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopProductsByShop(shopId, startDate, endDate, limit);

        return results.stream()
                .map(row -> {
                    Integer productId = (Integer) row[0];
                    String productName = (String) row[1];
                    String thumbnail = (String) row[2];
                    //                    Long quantitySold = (Long) row[3];
                    Integer quantitySold = ((BigDecimal) row[3]).intValue();
                    BigDecimal revenue = (BigDecimal) row[4];

                    return ProductStatsDTO.builder()
                            .productId(productId)
                            .productName(productName)
                            .thumbnail(thumbnail)
                            .quantitySold(quantitySold)
                            .revenue(revenue)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<OrderStatusCountDTO> getOrderStatusStatistics(
            LocalDateTime startDate, LocalDateTime endDate, Integer shopId) {
        List<Object[]> results;
        if (shopId != null) {
            results = orderRepository.getOrderStatusStatsByShop(shopId, startDate, endDate);
        } else {
            results = orderRepository.getOrderStatusStats(startDate, endDate);
        }

        return results.stream()
                .map(row -> {
                    String status = (String) row[0];
                    Long count = (Long) row[1];
                    BigDecimal totalAmount = (BigDecimal) row[2];

                    return OrderStatusCountDTO.builder()
                            .status(status)
                            .count(count)
                            .totalAmount(totalAmount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<CategoryStatsDTO> getCategoryStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = orderRepository.getCategoryStats(startDate, endDate);

        return results.stream()
                .map(row -> {
                    Integer categoryId = (Integer) row[0];
                    String categoryName = (String) row[1];
                    Long productCount = (Long) row[2];
                    Integer totalSold = ((BigDecimal) row[3]).intValue();
                    BigDecimal revenue = (BigDecimal) row[4];

                    return CategoryStatsDTO.builder()
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .productCount(productCount)
                            .totalSold(totalSold)
                            .revenue(revenue)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
