package com.finalthesis.ecommerce.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.finalthesis.ecommerce.dto.request.product.ProductCreationRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.dto.response.ProductResponse;
import com.finalthesis.ecommerce.dto.response.productdetail.ProductDetailResponse;
import com.finalthesis.ecommerce.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @GetMapping
    ApiResponse<Page<HomepageProductResponse>> getHomepageProducts(
            @RequestParam(name = "pageNumber") int pageNumber, @RequestParam(name = "pageSize") int pageSize) {
        return ApiResponse.<Page<HomepageProductResponse>>builder()
                .result(productService.getHomepageProducts(pageNumber, pageSize))
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER')")
    ApiResponse<ProductResponse> createProduct(
            @RequestPart("product") ProductCreationRequest request,
            @RequestPart(value = "thumbnail") MultipartFile thumbnail,
            @RequestPart(value = "thumbnailFiles", required = false) List<MultipartFile> thumbnailFiles) {
        request.setThumbnail(thumbnail);

        if (request.getProductItems() != null && thumbnailFiles != null)
            for (int i = 0; i < Math.min(request.getProductItems().size(), thumbnailFiles.size()); i++)
                request.getProductItems().get(i).setThumbnailFiles(thumbnailFiles.get(i));

        ProductResponse createdProduct = productService.createProduct(request);
        return ApiResponse.<ProductResponse>builder().result(createdProduct).build();
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    ApiResponse<Page<ProductResponse>> getSellerProducts(
            @RequestParam(name = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.getSellerProducts(pageNumber, pageSize))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ProductDetailResponse> getProductDetailById(@PathVariable Integer id) {
        ProductDetailResponse product = productService.getProductDetailById(id);
        return ApiResponse.<ProductDetailResponse>builder().result(product).build();
    }
}
