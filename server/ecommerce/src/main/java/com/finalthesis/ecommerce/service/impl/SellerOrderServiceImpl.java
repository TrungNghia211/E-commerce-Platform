package com.finalthesis.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finalthesis.ecommerce.dto.response.customerorder.*;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderDetailResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderStatisticsDto;
import com.finalthesis.ecommerce.entity.*;
import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.OrderMapper;
import com.finalthesis.ecommerce.repository.OrderRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.SellerOrderService;

import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional
public class SellerOrderServiceImpl implements SellerOrderService {
    OrderMapper orderMapper;

    OrderRepository orderRepository;
    UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getOrdersByShop(String search, OrderStatus status, Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Integer shopId = user.getShop().getId();

        Specification<Order> spec = buildOrderSpecification(shopId, search, status);
        Page<Order> orders = orderRepository.findAll(spec, pageable);
        return orders.map(orderMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetail(Integer orderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Integer shopId = user.getShop().getId();

        Order order = orderRepository
                .findByIdAndShopId(orderId, shopId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return orderMapper.toDetailResponseDto(order);
    }

    @Override
    public OrderResponseDto updateOrderStatus(Integer orderId, OrderStatus newStatus) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Integer shopId = user.getShop().getId();
        Order order = orderRepository
                .findByIdAndShopId(orderId, shopId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponseDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderStatisticsDto getOrderStatistics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Integer shopId = user.getShop().getId();
        List<Order> orders = orderRepository.findByShopId(shopId);

        long totalOrders = orders.size();
        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDING)
                .count();
        long processingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PROCESSING)
                .count();
        long shippingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.SHIPPING)
                .count();
        long deliveredOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();
        long cancelledOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .count();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderStatisticsDto.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippingOrders(shippingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .build();
    }

    private Specification<Order> buildOrderSpecification(Integer shopId, String search, OrderStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by shop
            predicates.add(cb.equal(root.get("shop").get("id"), shopId));

            // Search by order code, customer name, phone, or email
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("orderCode")), searchPattern),
                        cb.like(cb.lower(root.get("customerName")), searchPattern),
                        cb.like(cb.lower(root.get("customerPhone")), searchPattern),
                        cb.like(cb.lower(root.get("customerEmail")), searchPattern));
                predicates.add(searchPredicate);
            }

            // Filter by status
            if (status != null) predicates.add(cb.equal(root.get("status"), status));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Define valid status transitions
        Map<OrderStatus, Set<OrderStatus>> validTransitions = Map.of(
                OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
                OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
                OrderStatus.PROCESSING, Set.of(OrderStatus.SHIPPING, OrderStatus.CANCELLED),
                OrderStatus.SHIPPING, Set.of(OrderStatus.DELIVERED),
                OrderStatus.DELIVERED, Set.of(), // No transitions allowed from DELIVERED
                OrderStatus.CANCELLED, Set.of() // No transitions allowed from CANCELLED
                );

        //        if (!validTransitions.get(currentStatus).contains(newStatus))
        //            throw new InvalidStatusTransitionException(
        //                    String.format("Không thể chuyển từ trạng thái %s sang %s", currentStatus, newStatus)
        //            );
    }
}
