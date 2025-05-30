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
    @Mapping(target = "purchaseCount", ignore = true) // Defaults to 0
    @Mapping(target = "createdAt", ignore = true) // Handled by @CreationTimestamp
    @Mapping(target = "updatedAt", ignore = true) // Handled by @UpdateTimestamp
    @Mapping(target = "category", ignore = true) // Set in service
    @Mapping(target = "shop", ignore = true) // Set in service
    @Mapping(target = "productItems", ignore = true) // Mapped separately
    @Mapping(target = "variations", ignore = true) // Mapped separately
    @Mapping(target = "thumbnail", ignore = true)
    Product toProduct(ProductCreationRequest request);

    ProductResponse toProductResponse(Product product);
}
