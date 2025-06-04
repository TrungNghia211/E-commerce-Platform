package com.finalthesis.ecommerce.controller;

import java.util.Map;

import com.finalthesis.ecommerce.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.payment.CreateOrderRequest;
import com.finalthesis.ecommerce.dto.request.payment.PaymentReturnResponse;
import com.finalthesis.ecommerce.service.PaymentService;
import com.finalthesis.ecommerce.utils.VNPayUtils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;

    @PostMapping("/create-order")
    public ApiResponse<String> createOrder(@RequestBody CreateOrderRequest request, HttpServletRequest httpServletRequest) {
        var ipAddress = VNPayUtils.getIpAddress(httpServletRequest);
        request.setIpAddress(ipAddress);
        return ApiResponse.<String>builder()
                .result(paymentService.createOrder(request))
                .build();
    }

    @GetMapping("/ipn")
    public ResponseEntity<?> processIpn(@RequestParam Map<String, String> params) {
        try {
            PaymentReturnResponse response = paymentService.processIpn(params);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(PaymentReturnResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }
}
