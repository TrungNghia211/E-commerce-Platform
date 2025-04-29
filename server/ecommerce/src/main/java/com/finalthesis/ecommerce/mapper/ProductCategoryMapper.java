package com.finalthesis.ecommerce.mapper;

import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.entity.ProductCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {

    ProductCategoryResponse toProductCategoryResponse(ProductCategory productCategory);

}
