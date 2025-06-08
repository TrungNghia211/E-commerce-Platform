package com.finalthesis.ecommerce.controller;

import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.customerorder.OrderDetailDTO;
import com.finalthesis.ecommerce.dto.response.customerorder.OrderListResponse;
import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.service.CustomerOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/customer/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerOrderController {
    CustomerOrderService customerOrderService;

    @GetMapping
    public ApiResponse<OrderListResponse> getCustomerOrders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(required = false) OrderStatus status) {

        OrderListResponse response = customerOrderService.getCustomerOrders(page, size, status);
        return ApiResponse.<OrderListResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailDTO> getOrderDetail(
            @PathVariable Integer orderId) {
        OrderDetailDTO orderDetail = customerOrderService.getOrderDetail(orderId);
        return ApiResponse.<OrderDetailDTO>builder()
                .result(orderDetail)
                .build();
    }

    @GetMapping("/date-range")
    public ApiResponse<OrderListResponse> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        OrderListResponse response = customerOrderService.getOrdersByDateRange(
                startDate, endDate, page, size);
        return ApiResponse.<OrderListResponse>builder()
                .result(response)
                .build();
    }
}
