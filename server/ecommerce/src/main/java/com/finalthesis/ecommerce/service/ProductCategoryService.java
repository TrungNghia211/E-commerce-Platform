package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;

import java.util.List;

public interface ProductCategoryService {

    List<ProductCategoryResponse> findAll();

}
