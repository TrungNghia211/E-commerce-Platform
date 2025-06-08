package com.finalthesis.ecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.finalthesis.ecommerce.dto.response.sellerorder.OrderDetailResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderStatisticsDto;
import com.finalthesis.ecommerce.enums.OrderStatus;

public interface SellerOrderService {
    Page<OrderResponseDto> getOrdersByShop(String search, OrderStatus status, Pageable pageable);

    OrderDetailResponseDto getOrderDetail(Integer orderId);

    OrderResponseDto updateOrderStatus(Integer orderId, OrderStatus newStatus);

    OrderStatisticsDto getOrderStatistics();
}
