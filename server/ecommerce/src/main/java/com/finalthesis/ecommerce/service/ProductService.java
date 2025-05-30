package com.finalthesis.ecommerce.service;

import org.springframework.data.domain.Page;

import com.finalthesis.ecommerce.dto.request.product.ProductCreationRequest;
import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.dto.response.ProductResponse;

public interface ProductService {
    Page<HomepageProductResponse> getHomepageProducts(int pageNumber, int pageSize);

    ProductResponse createProduct(ProductCreationRequest request);

    Page<ProductResponse> getSellerProducts(int pageNumber, int pageSize);
}
