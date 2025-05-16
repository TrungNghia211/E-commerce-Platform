package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.request.ProductCategoryCreationRequest;
import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.entity.ProductCategory;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {
    @Mapping(target = "thumbnail", ignore = true)
    ProductCategory toProductCategory(ProductCategoryCreationRequest request);

    ProductCategoryResponse toProductCategoryResponse(ProductCategory productCategory);
}
