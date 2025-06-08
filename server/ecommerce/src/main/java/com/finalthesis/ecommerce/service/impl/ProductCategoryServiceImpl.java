package com.finalthesis.ecommerce.service.impl;

import java.io.IOException;
import java.util.*;

import org.springframework.stereotype.Service;

import com.finalthesis.ecommerce.dto.request.ProductCategoryCreationRequest;
import com.finalthesis.ecommerce.dto.response.ProductCategoryResponse;
import com.finalthesis.ecommerce.entity.ProductCategory;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.ProductCategoryMapper;
import com.finalthesis.ecommerce.repository.ProductCategoryRepository;
import com.finalthesis.ecommerce.service.CloudinaryService;
import com.finalthesis.ecommerce.service.ProductCategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {
    ProductCategoryRepository productCategoryRepository;

    ProductCategoryMapper productCategoryMapper;

    CloudinaryService cloudinaryService;

    public List<ProductCategoryResponse> findTop8ByOrderByCreatedAtDesc() {
        return productCategoryRepository.findTop8ByParentCategoryIdIsNullOrderByCreatedAtDesc().stream()
                .map(productCategoryMapper::toProductCategoryResponse)
                .toList();
    }

    @Override
    public ProductCategoryResponse createProductCategory(ProductCategoryCreationRequest request) {
        if (productCategoryRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.PRODUCT_CATEGORY_NAME_EXISTED);
        else if (productCategoryRepository.existsBySlug(request.getSlug()))
            throw new AppException(ErrorCode.SLUG_EXISTED);

        ProductCategory productCategory = productCategoryMapper.toProductCategory(request);
        if (request.getParentCategoryId() != null) {
            ProductCategory parentCategory = productCategoryRepository
                    .findById(request.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));
            productCategory.setParentCategory(parentCategory);
        } else productCategory.setParentCategory(null);

        try {
            if (request.getThumbnail() != null) {
                String thumbnailUrl = cloudinaryService.uploadFile(request.getThumbnail());
                productCategory.setThumbnail(thumbnailUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return productCategoryMapper.toProductCategoryResponse(productCategoryRepository.save(productCategory));
    }

    @Override
    public List<ProductCategoryResponse> getAllHierarchicalCategories() {
        List<ProductCategory> allCategories = productCategoryRepository.findAll();

        // Build map: id -> category
        Map<Integer, ProductCategoryResponse> idToDto = new HashMap<>();
        for (ProductCategory cat : allCategories) {
            idToDto.put(cat.getId(), productCategoryMapper.toProductCategoryResponse(cat));
        }

        // Build tree
        List<ProductCategoryResponse> roots = new ArrayList<>();
        for (ProductCategory cat : allCategories) {
            ProductCategoryResponse dto = idToDto.get(cat.getId());
            if (cat.getParentCategory() == null) {
                roots.add(dto);
            } else {
                // Gán con vào cha
                ProductCategoryResponse parentDto =
                        idToDto.get(cat.getParentCategory().getId());
                if (parentDto.getSubCategories() == null) parentDto.setSubCategories(new HashSet<>());
                parentDto.getSubCategories().add(dto);
            }
        }
        return roots;
    }
}
