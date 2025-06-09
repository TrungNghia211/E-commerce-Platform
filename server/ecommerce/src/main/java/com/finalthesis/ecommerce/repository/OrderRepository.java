package com.finalthesis.ecommerce.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Order;
import com.finalthesis.ecommerce.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByOrderCode(String orderCode);

    @Query("SELECT o FROM Order o " + "JOIN FETCH o.productItem pi "
            + "JOIN FETCH pi.product p "
            + "JOIN FETCH o.shop s "
            + "WHERE o.user.id = :userId "
            + "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId, Pageable pageable);

    @Query("SELECT o FROM Order o " + "JOIN FETCH o.productItem pi "
            + "JOIN FETCH pi.product p "
            + "JOIN FETCH o.shop s "
            + "WHERE o.user.id = :userId AND o.status = :status "
            + "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(
            @Param("userId") Integer userId, @Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o " + "JOIN FETCH o.productItem pi "
            + "JOIN FETCH pi.product p "
            + "LEFT JOIN FETCH pi.variationOptions vo "
            + "LEFT JOIN FETCH vo.variation v "
            + "JOIN FETCH o.shop s "
            + "WHERE o.id = :orderId AND o.user.id = :userId")
    Order findByIdAndUserId(@Param("orderId") Integer orderId, @Param("userId") Integer userId);

    @Query("SELECT o FROM Order o " + "JOIN FETCH o.productItem pi "
            + "JOIN FETCH pi.product p "
            + "JOIN FETCH o.shop s "
            + "WHERE o.orderCode = :orderCode AND o.user.id = :userId")
    Order findByOrderCodeAndUserId(@Param("orderCode") String orderCode, @Param("userId") Integer userId);

    @Query("SELECT o FROM Order o " + "JOIN FETCH o.productItem pi "
            + "JOIN FETCH pi.product p "
            + "JOIN FETCH o.shop s "
            + "WHERE o.user.id = :userId "
            + "AND o.createdAt BETWEEN :startDate AND :endDate "
            + "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndCreatedAtBetween(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    Optional<Order> findByIdAndShopId(Integer id, Integer shopId);

    List<Order> findByShopId(Integer shopId);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId AND "
            + "(LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(o.customerPhone) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Order> findByShopIdAndSearch(
            @Param("shopId") Integer shopId, @Param("search") String search, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId AND o.status = :status")
    Page<Order> findByShopIdAndStatus(
            @Param("shopId") Integer shopId, @Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND o.status = :status")
    Long countByShopIdAndStatus(@Param("shopId") Integer shopId, @Param("status") OrderStatus status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.shop.id = :shopId AND o.status = :status")
    BigDecimal sumTotalAmountByShopIdAndStatus(@Param("shopId") Integer shopId, @Param("status") OrderStatus status);

    // Basic count and sum methods
    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByShopIdAndCreatedAtBetween(Integer shopId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountByCreatedAtBetween(
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(
            "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.shop.id = :shopId AND o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountByShopIdAndCreatedAtBetween(
            @Param("shopId") Integer shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query(
            "SELECT COUNT(DISTINCT o.productItem.product.id) FROM Order o WHERE o.shop.id = :shopId AND o.createdAt BETWEEN :startDate AND :endDate")
    Long countDistinctProductsByShopIdAndCreatedAtBetween(
            @Param("shopId") Integer shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Monthly revenue queries
    @Query(
            value =
                    """
		SELECT
			DATE_FORMAT(o.created_at, '%Y-%m') as month,
			COALESCE(SUM(o.total_amount), 0) as revenue,
			COUNT(*) as order_count
		FROM orders o
		WHERE o.created_at BETWEEN :startDate AND :endDate
		GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
		ORDER BY month DESC
		""",
            nativeQuery = true)
    List<Object[]> getMonthlyRevenue(
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(
            value =
                    """
		SELECT
			DATE_FORMAT(o.created_at, '%Y-%m') as month,
			COALESCE(SUM(o.total_amount), 0) as revenue,
			COUNT(*) as order_count
		FROM orders o
		WHERE o.shop_id = :shopId AND o.created_at BETWEEN :startDate AND :endDate
		GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
		ORDER BY month DESC
		""",
            nativeQuery = true)
    List<Object[]> getMonthlyRevenueByShop(
            @Param("shopId") Integer shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Top sellers query
    @Query(
            value =
                    """
		SELECT
			s.id as seller_id,
			s.name as seller_name,
			COALESCE(SUM(o.total_amount), 0) as total_revenue,
			COUNT(*) as total_orders
		FROM orders o
		JOIN shop s ON o.shop_id = s.id
		WHERE o.created_at BETWEEN :startDate AND :endDate
		GROUP BY s.id, s.name
		ORDER BY total_revenue DESC
		LIMIT :limit
		""",
            nativeQuery = true)
    List<Object[]> getTopSellers(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("limit") int limit);

    // Top products for seller
    @Query(
            value =
                    """
		SELECT
			p.id as product_id,
			p.name as product_name,
			p.thumbnail,
			COALESCE(SUM(o.quantity), 0) as quantity_sold,
			COALESCE(SUM(o.total_amount), 0) as revenue
		FROM orders o
		JOIN product_item pi ON o.product_item_id = pi.id
		JOIN product p ON pi.product_id = p.id
		WHERE o.shop_id = :shopId AND o.created_at BETWEEN :startDate AND :endDate
		GROUP BY p.id, p.name, p.thumbnail
		ORDER BY revenue DESC
		LIMIT :limit
		""",
            nativeQuery = true)
    List<Object[]> getTopProductsByShop(
            @Param("shopId") Integer shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("limit") int limit);

    // Order status statistics
    @Query(
            value =
                    """
		SELECT
			o.status,
			COUNT(*) as count,
			COALESCE(SUM(o.total_amount), 0) as total_amount
		FROM orders o
		WHERE o.created_at BETWEEN :startDate AND :endDate
		GROUP BY o.status
		ORDER BY count DESC
		""",
            nativeQuery = true)
    List<Object[]> getOrderStatusStats(
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(
            value =
                    """
		SELECT
			o.status,
			COUNT(*) as count,
			COALESCE(SUM(o.total_amount), 0) as total_amount
		FROM orders o
		WHERE o.shop_id = :shopId AND o.created_at BETWEEN :startDate AND :endDate
		GROUP BY o.status
		ORDER BY count DESC
		""",
            nativeQuery = true)
    List<Object[]> getOrderStatusStatsByShop(
            @Param("shopId") Integer shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Category statistics
    @Query(
            value =
                    """
		SELECT
			pc.id as category_id,
			pc.name as category_name,
			COUNT(DISTINCT p.id) as product_count,
			COALESCE(SUM(o.quantity), 0) as total_sold,
			COALESCE(SUM(o.total_amount), 0) as revenue
		FROM orders o
		JOIN product_item pi ON o.product_item_id = pi.id
		JOIN product p ON pi.product_id = p.id
		JOIN product_category pc ON p.category_id = pc.id
		WHERE o.created_at BETWEEN :startDate AND :endDate
		GROUP BY pc.id, pc.name
		ORDER BY revenue DESC
		""",
            nativeQuery = true)
    List<Object[]> getCategoryStats(
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
