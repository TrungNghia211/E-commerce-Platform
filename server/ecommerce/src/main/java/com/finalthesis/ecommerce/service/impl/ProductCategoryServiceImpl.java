package com.finalthesis.ecommerce.service.impl;

import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.mapper.ProductCategoryMapper;
import com.finalthesis.ecommerce.repository.ProductCategoryRepository;
import com.finalthesis.ecommerce.service.ProductCategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    ProductCategoryRepository productCategoryRepository;

    ProductCategoryMapper productCategoryMapper;

    public List<ProductCategoryResponse> findAll() {
        return productCategoryRepository.findTop8ByOrderByCreatedAtDesc()
                                        .stream()
                                        .map(productCategoryMapper::toProductCategoryResponse)
                                        .toList();
    }

}
