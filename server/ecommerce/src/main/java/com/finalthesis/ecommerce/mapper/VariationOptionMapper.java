package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.request.product.VariationOptionRequest;
import com.finalthesis.ecommerce.entity.VariationOption;

@Mapper(componentModel = "spring")
public interface VariationOptionMapper {
    @Mapping(target = "id", ignore = true) // ID is generated
    @Mapping(target = "variation", ignore = true) // Set in service
    @Mapping(target = "productItems", ignore = true) // Handled in ProductItem mapping
    VariationOption toVariationOption(VariationOptionRequest request);

    //    VariationOptionResponse toVariationOptionResponse(VariationOption variationOption);
}
