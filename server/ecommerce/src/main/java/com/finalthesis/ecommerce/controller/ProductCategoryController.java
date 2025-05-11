package com.finalthesis.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.service.ProductCategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductCategoryController {

    ProductCategoryService productCategoryService;

    @GetMapping
    ApiResponse<List<ProductCategoryResponse>> getAll() {
        return ApiResponse.<List<ProductCategoryResponse>>builder()
                .result(productCategoryService.findAll())
                .build();
    }
}
