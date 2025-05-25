package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.finalthesis.ecommerce.dto.request.ShopCreationRequest;
import com.finalthesis.ecommerce.dto.response.ShopResponse;
import com.finalthesis.ecommerce.entity.Shop;

@Mapper(componentModel = "spring")
public interface ShopMapper {
    Shop toShop(ShopCreationRequest request);

    ShopResponse toShopResponse(Shop shop);
}
