package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.request.product.ProductItemRequest;
import com.finalthesis.ecommerce.entity.ProductItem;

@Mapper(
        componentModel = "spring",
        uses = {VariationOptionMapper.class})
public interface ProductItemMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "variationOptions", ignore = true)
    ProductItem toProductItem(ProductItemRequest request);

    //    @Mapping(target = "variationOptions", source = "variationOptions")
    //    ProductItemResponse toProductItemResponse(ProductItem productItem);

    //    List<ProductItemResponse> toProductItemResponses(List<ProductItem> productItems);
}
