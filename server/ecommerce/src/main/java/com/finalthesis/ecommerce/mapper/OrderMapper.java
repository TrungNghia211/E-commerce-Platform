package com.finalthesis.ecommerce.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.response.sellerorder.*;
import com.finalthesis.ecommerce.entity.*;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "productItem", source = "productItem")
    OrderResponseDto toResponseDto(Order order);

    @Mapping(target = "productItem", source = "productItem")
    @Mapping(target = "customer", source = "user")
    OrderDetailResponseDto toDetailResponseDto(Order order);

    @Mapping(target = "product", source = "product")
    @Mapping(target = "variationOptions", source = "variationOptions")
    ProductItemDto toProductItemDto(ProductItem productItem);

    @Mapping(target = "product", source = "product")
    @Mapping(target = "variationOptions", source = "variationOptions")
    ProductItemDetailDto toProductItemDetailDto(ProductItem productItem);

    @Mapping(target = "category", source = "category")
    ProductDto toProductDto(Product product);

    ProductCategoryDto toProductCategoryDto(ProductCategory category);

    @Mapping(target = "variation", source = "variation")
    VariationOptionDto toVariationOptionDto(VariationOption variationOption);

    VariationDto toVariationDto(Variation variation);

    CustomerDto toCustomerDto(User user);

    List<OrderResponseDto> toResponseDtoList(List<Order> orders);
}
