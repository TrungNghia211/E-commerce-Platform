package com.finalthesis.ecommerce.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.ProductCategoryCreationRequest;
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
    ApiResponse<List<ProductCategoryResponse>> findTop8ProductCategoryByOrderByCreatedAtDesc() {
        return ApiResponse.<List<ProductCategoryResponse>>builder()
                .result(productCategoryService.findTop8ByOrderByCreatedAtDesc())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<ProductCategoryResponse> createProductCategory(@ModelAttribute ProductCategoryCreationRequest request) {
        return ApiResponse.<ProductCategoryResponse>builder()
                .result(productCategoryService.createProductCategory(request))
                .build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<ProductCategoryResponse>> getAllHierarchicalCategories() {
        return ApiResponse.<List<ProductCategoryResponse>>builder()
                .result(productCategoryService.getAllHierarchicalCategories())
                .build();
    }
}
