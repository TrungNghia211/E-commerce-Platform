package com.finalthesis.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderDetailResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderResponseDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.OrderStatisticsDto;
import com.finalthesis.ecommerce.dto.response.sellerorder.UpdateOrderStatusDto;
import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.service.SellerOrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/seller/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SellerOrderController {
    SellerOrderService sellerOrderService;

    @GetMapping
    public ApiResponse<Page<OrderResponseDto>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) OrderStatus status) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending());

        Page<OrderResponseDto> orders = sellerOrderService.getOrdersByShop(search, status, pageable);

        return ApiResponse.<Page<OrderResponseDto>>builder().result(orders).build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailResponseDto> getOrderDetail(@PathVariable Integer orderId) {
        return ApiResponse.<OrderDetailResponseDto>builder()
                .result(sellerOrderService.getOrderDetail(orderId))
                .build();
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponseDto> updateOrderStatus(
            @PathVariable Integer orderId, @RequestBody UpdateOrderStatusDto updateDto) {
        return ApiResponse.<OrderResponseDto>builder()
                .result(sellerOrderService.updateOrderStatus(orderId, updateDto.getStatus()))
                .build();
    }

    @GetMapping("/statistics")
    public ApiResponse<OrderStatisticsDto> getOrderStatistics() {
        return ApiResponse.<OrderStatisticsDto>builder()
                .result(sellerOrderService.getOrderStatistics())
                .build();
    }
}
