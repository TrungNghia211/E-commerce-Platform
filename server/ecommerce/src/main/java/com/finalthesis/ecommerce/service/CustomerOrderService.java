package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.response.customerorder.OrderDetailDTO;
import com.finalthesis.ecommerce.dto.response.customerorder.OrderListResponse;
import com.finalthesis.ecommerce.enums.OrderStatus;

import java.time.LocalDateTime;

public interface CustomerOrderService {
    OrderListResponse getCustomerOrders(Integer page, Integer size, OrderStatus status);

    OrderDetailDTO getOrderDetail(Integer orderId);

    OrderListResponse getOrdersByDateRange(LocalDateTime startDate,
                                           LocalDateTime endDate, Integer page, Integer size);
}
