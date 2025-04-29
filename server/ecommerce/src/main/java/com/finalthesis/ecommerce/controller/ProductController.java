package com.finalthesis.ecommerce.controller;

import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @GetMapping
    ApiResponse<Page<HomepageProductResponse>> getHomepageProducts(
            @RequestParam(name = "pageNumber") int pageNumber,
            @RequestParam(name = "pageSize") int pageSize) {
        return ApiResponse.<Page<HomepageProductResponse>>builder()
                          .result(productService.getHomepageProducts(pageNumber, pageSize))
                          .build();
    }

}
