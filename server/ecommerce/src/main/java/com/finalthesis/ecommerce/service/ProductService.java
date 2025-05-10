package com.finalthesis.ecommerce.service;

import org.springframework.data.domain.Page;

import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;

public interface ProductService {

    Page<HomepageProductResponse> getHomepageProducts(int pageNumber, int pageSize);
}
