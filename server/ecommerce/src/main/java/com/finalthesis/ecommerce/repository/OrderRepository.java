package com.finalthesis.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import com.finalthesis.ecommerce.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderCode(String orderCode);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.productItem pi " +
            "JOIN FETCH pi.product p " +
            "JOIN FETCH o.shop s " +
            "WHERE o.user.id = :userId " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId, Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.productItem pi " +
            "JOIN FETCH pi.product p " +
            "JOIN FETCH o.shop s " +
            "WHERE o.user.id = :userId AND o.status = :status " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(
            @Param("userId") Integer userId,
            @Param("status") OrderStatus status,
            Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.productItem pi " +
            "JOIN FETCH pi.product p " +
            "LEFT JOIN FETCH pi.variationOptions vo " +
            "LEFT JOIN FETCH vo.variation v " +
            "JOIN FETCH o.shop s " +
            "WHERE o.id = :orderId AND o.user.id = :userId")
    Order findByIdAndUserId(@Param("orderId") Integer orderId, @Param("userId") Integer userId);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.productItem pi " +
            "JOIN FETCH pi.product p " +
            "JOIN FETCH o.shop s " +
            "WHERE o.orderCode = :orderCode AND o.user.id = :userId")
    Order findByOrderCodeAndUserId(@Param("orderCode") String orderCode, @Param("userId") Integer userId);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.productItem pi " +
            "JOIN FETCH pi.product p " +
            "JOIN FETCH o.shop s " +
            "WHERE o.user.id = :userId " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndCreatedAtBetween(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}
