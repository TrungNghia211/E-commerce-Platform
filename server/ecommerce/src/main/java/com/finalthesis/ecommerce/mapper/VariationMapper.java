package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.finalthesis.ecommerce.dto.request.product.VariationCreationRequest;
import com.finalthesis.ecommerce.entity.Variation;

@Mapper(componentModel = "spring", uses = VariationOptionMapper.class)
public interface VariationMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(source = "options", target = "variationOptions")
    Variation toVariation(VariationCreationRequest request);

    //    @Mapping(target = "variationOptions", source = "variationOptions")
    //    VariationResponse toVariationResponse(Variation variation);

    //    List<VariationResponse> toVariationResponses(List<Variation> variations);
}
