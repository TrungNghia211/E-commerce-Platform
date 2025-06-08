package com.finalthesis.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finalthesis.ecommerce.dto.response.customerorder.*;
import com.finalthesis.ecommerce.entity.*;
import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.repository.OrderRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.CustomerOrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerOrderServiceImpl implements CustomerOrderService {
    OrderRepository orderRepository;
    UserRepository userRepository;

    @Override
    public OrderListResponse getCustomerOrders(Integer page, Integer size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage;

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (status != null)
            orderPage = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), status, pageable);
        else orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<OrderDTO> orderDTOs =
                orderPage.getContent().stream().map(this::convertToOrderDTO).collect(Collectors.toList());

        return OrderListResponse.builder()
                .orders(orderDTOs)
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .currentPage(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .hasNext(orderPage.hasNext())
                .hasPrevious(orderPage.hasPrevious())
                .build();
    }

    @Override
    public OrderDetailDTO getOrderDetail(Integer orderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId());
        if (order == null) throw new RuntimeException("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập");

        return convertToOrderDetailDTO(order);
    }

    @Override
    public OrderListResponse getOrdersByDateRange(
            LocalDateTime startDate, LocalDateTime endDate, Integer page, Integer size) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage =
                orderRepository.findByUserIdAndCreatedAtBetween(user.getId(), startDate, endDate, pageable);

        List<OrderDTO> orderDTOs =
                orderPage.getContent().stream().map(this::convertToOrderDTO).collect(Collectors.toList());

        return OrderListResponse.builder()
                .orders(orderDTOs)
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .currentPage(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .hasNext(orderPage.hasNext())
                .hasPrevious(orderPage.hasPrevious())
                .build();
    }

    private OrderDTO convertToOrderDTO(Order order) {
        ProductItem productItem = order.getProductItem();
        Product product = productItem.getProduct();
        Shop shop = order.getShop();

        return OrderDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .shippingAddress(order.getShippingAddress())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .productItem(ProductItemDTO.builder()
                        .id(productItem.getId())
                        .sku(productItem.getSku())
                        .price(productItem.getPrice())
                        .thumbnail(productItem.getThumbnail())
                        .productName(product.getName())
                        .build())
                .shop(ShopDTO.builder()
                        .id(shop.getId())
                        .name(shop.getName())
                        .avatar(shop.getAvatar())
                        .build())
                .build();
    }

    private OrderDetailDTO convertToOrderDetailDTO(Order order) {
        ProductItem productItem = order.getProductItem();
        Product product = productItem.getProduct();
        Shop shop = order.getShop();

        List<VariationOptionDTO> variationOptions = productItem.getVariationOptions().stream()
                .map(vo -> VariationOptionDTO.builder()
                        .id(vo.getId())
                        .value(vo.getValue())
                        .variationName(vo.getVariation().getName())
                        .build())
                .collect(Collectors.toList());

        return OrderDetailDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .shippingAddress(order.getShippingAddress())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .productItem(ProductItemDetailDTO.builder()
                        .id(productItem.getId())
                        .sku(productItem.getSku())
                        .price(productItem.getPrice())
                        .thumbnail(productItem.getThumbnail())
                        .productName(product.getName())
                        .productDescription(product.getDescription())
                        .variationOptions(variationOptions)
                        .build())
                .shop(ShopDTO.builder()
                        .id(shop.getId())
                        .name(shop.getName())
                        .avatar(shop.getAvatar())
                        .build())
                .build();
    }
}
