package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.entity.ProductCategory;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {

    ProductCategoryResponse toProductCategoryResponse(ProductCategory productCategory);
}
