package com.finalthesis.ecommerce.utils;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.finalthesis.ecommerce.dto.response.productdetail.ProductDetailResponse;
import com.finalthesis.ecommerce.dto.response.productdetail.ProductItemResponse;
import com.finalthesis.ecommerce.dto.response.productdetail.VariationOptionResponse;
import com.finalthesis.ecommerce.dto.response.productdetail.VariationResponse;
import com.finalthesis.ecommerce.entity.Product;
import com.finalthesis.ecommerce.entity.ProductItem;
import com.finalthesis.ecommerce.entity.Variation;
import com.finalthesis.ecommerce.entity.VariationOption;

public class ProductMapperManual {
    public static VariationOptionResponse toVariationOptionResponse(VariationOption option) {
        if (option == null) {
            return null;
        }
        return VariationOptionResponse.builder()
                .id(option.getId())
                .value(option.getValue())
                .build();
    }

    /**
     * Chuyển danh sách VariationOption → List<VariationOptionResponse>
     */
    public static Set<VariationOptionResponse> toVariationOptionResponseList(Set<VariationOption> options) {
        //        if (options == null) {
        //            return Collections.emptyList();
        //        }
        return options.stream()
                .map(ProductMapperManual::toVariationOptionResponse)
                .collect(Collectors.toSet());
    }

    /**
     * Chuyển Variation entity → VariationResponse DTO
     */
    public static VariationResponse toVariationResponse(Variation variation) {
        if (variation == null) {
            return null;
        }
        Set<VariationOptionResponse> optionDtos = toVariationOptionResponseList(variation.getVariationOptions());
        return VariationResponse.builder()
                .id(variation.getId())
                .name(variation.getName())
                .variationOptions(optionDtos)
                .build();
    }

    /**
     * Chuyển danh sách Variation → List<VariationResponse>
     */
    public static List<VariationResponse> toVariationResponseList(Set<Variation> variations) {
        if (variations == null) {
            return Collections.emptyList();
        }
        return variations.stream().map(ProductMapperManual::toVariationResponse).collect(Collectors.toList());
    }

    /**
     * Chuyển ProductItem entity → ProductItemResponse DTO
     */
    public static ProductItemResponse toProductItemResponse(ProductItem item) {
        if (item == null) return null;
        Set<VariationOptionResponse> optionDtos = toVariationOptionResponseList(item.getVariationOptions());
        return ProductItemResponse.builder()
                .id(item.getId())
                .quantityInStock(item.getQuantityInStock())
                .price(item.getPrice())
                .thumbnail(item.getThumbnail())
                .variationOptions(optionDtos)
                .build();
    }

    /**
     * Chuyển danh sách ProductItem → List<ProductItemResponse>
     */
    public static List<ProductItemResponse> toProductItemResponseList(Set<ProductItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }
        return items.stream().map(ProductMapperManual::toProductItemResponse).collect(Collectors.toList());
    }

    public static ProductDetailResponse toProductDetailResponse(Product product) {
        if (product == null) {
            return null;
        }

        // Lấy categoryName và shopName (cần check null nếu không chắc các quan hệ luôn có giá trị)
        String categoryName = null;
        if (product.getCategory() != null) {
            categoryName = product.getCategory().getName();
        }

        String shopName = null;
        if (product.getShop() != null) {
            shopName = product.getShop().getName();
        }

        List<ProductItemResponse> itemDtos = toProductItemResponseList(product.getProductItems());
        List<VariationResponse> variationDtos = toVariationResponseList(product.getVariations());

        // Khởi tạo và trả về ProductDetailResponse
        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .quantityInStock(product.getQuantityInStock())
                .price(product.getPrice())
                .buyTurn(product.getBuyTurn())
                .thumbnail(product.getThumbnail())
                .purchaseCount(product.getPurchaseCount())
                .categoryName(categoryName)
                .productItems(itemDtos)
                .variations(variationDtos)
                .build();
    }
}
