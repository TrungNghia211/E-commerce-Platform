package com.finalthesis.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finalthesis.ecommerce.dto.request.ShopCreationRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.ShopResponse;
import com.finalthesis.ecommerce.service.ShopService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/shops")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShopController {
    ShopService shopService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    ApiResponse<ShopResponse> createShop(@ModelAttribute ShopCreationRequest request) {
        return ApiResponse.<ShopResponse>builder()
                .result(shopService.createShop(request))
                .build();
    }
}
