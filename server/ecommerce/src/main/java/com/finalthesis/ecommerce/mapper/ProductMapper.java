package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.request.product.ProductCreationRequest;
import com.finalthesis.ecommerce.dto.response.ProductResponse;
import com.finalthesis.ecommerce.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quantityInStock", ignore = true)
    @Mapping(target = "buyTurn", ignore = true) // Defaults to 0 or handled separately
    @Mapping(target = "purchaseCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "shop", ignore = true)
    @Mapping(target = "productItems", ignore = true) // Mapped separately
    @Mapping(target = "variations", ignore = true) // Mapped separately
    @Mapping(target = "thumbnail", ignore = true)
    Product toProduct(ProductCreationRequest request);

    ProductResponse toProductResponse(Product product);

    //    @Mapping(target = "categoryName", source = "category.name")
    //    @Mapping(target = "productItems", source = "productItems")
    //    @Mapping(target = "variations", source = "variations")
    //    ProductDetailResponse toProductDetailResponse(Product product);

    //    List<ProductItemResponse> toProductItemResponseList(List<ProductItem> items);

    //    @Mapping(target = "variationOptions", source = "variationOptions")
    //    ProductItemResponse toProductItemResponse(ProductItem item);
}
