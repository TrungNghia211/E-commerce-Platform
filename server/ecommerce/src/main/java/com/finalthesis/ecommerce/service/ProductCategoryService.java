package com.finalthesis.ecommerce.service;

import java.util.List;

import com.finalthesis.ecommerce.dto.request.ProductCategoryCreationRequest;
import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;

public interface ProductCategoryService {
    List<ProductCategoryResponse> findTop8ByOrderByCreatedAtDesc();

    ProductCategoryResponse createProductCategory(ProductCategoryCreationRequest request);

    List<ProductCategoryResponse> getAllHierarchicalCategories();
}
