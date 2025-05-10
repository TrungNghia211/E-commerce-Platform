package com.finalthesis.ecommerce.service;

import java.util.List;

import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;

public interface ProductCategoryService {

    List<ProductCategoryResponse> findAll();
}
