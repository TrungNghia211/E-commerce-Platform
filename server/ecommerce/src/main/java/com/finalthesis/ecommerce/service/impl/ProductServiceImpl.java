package com.finalthesis.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.finalthesis.ecommerce.dto.request.product.ProductCreationRequest;
import com.finalthesis.ecommerce.dto.request.product.ProductItemRequest;
import com.finalthesis.ecommerce.dto.request.product.VariationCreationRequest;
import com.finalthesis.ecommerce.dto.request.product.VariationOptionRequest;
import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.dto.response.ProductResponse;
import com.finalthesis.ecommerce.entity.*;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.ProductItemMapper;
import com.finalthesis.ecommerce.mapper.ProductMapper;
import com.finalthesis.ecommerce.mapper.VariationMapper;
import com.finalthesis.ecommerce.mapper.VariationOptionMapper;
import com.finalthesis.ecommerce.repository.ProductCategoryRepository;
import com.finalthesis.ecommerce.repository.ProductItemRepository;
import com.finalthesis.ecommerce.repository.ProductRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.CloudinaryService;
import com.finalthesis.ecommerce.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    CloudinaryService cloudinaryService;

    ProductRepository productRepository;
    ProductItemRepository productItemRepository;
    ProductCategoryRepository productCategoryRepository;
    UserRepository userRepository;

    ProductMapper productMapper;
    ProductItemMapper productItemMapper;
    VariationMapper variationMapper;
    VariationOptionMapper variationOptionMapper;

    @Override
    public Page<HomepageProductResponse> getHomepageProducts(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        return productRepository.getHomepageProducts(pageable);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreationRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ProductCategory category = productCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));

        Shop shop = user.getShop();

        Product product = productMapper.toProduct(request);
        product.setCategory(category);
        product.setShop(shop);

        MultipartFile productThumbnailFile = request.getThumbnail();
        if (productThumbnailFile != null && !productThumbnailFile.isEmpty())
            try {
                String thumbnailUrl = cloudinaryService.uploadFile(productThumbnailFile);
                product.setThumbnail(thumbnailUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload product thumbnail", e);
            }

        // Create and link Variations and VariationOptions
        List<Variation> variations = new ArrayList<>();
        if (request.getVariations() != null) {
            for (VariationCreationRequest variationDTO : request.getVariations()) {
                Variation variation = variationMapper.toVariation(variationDTO);
                variation.setProduct(product);

                List<VariationOption> options = new ArrayList<>();
                if (variationDTO.getOptions() != null) {
                    for (VariationOptionRequest optionDTO : variationDTO.getOptions()) {
                        VariationOption option = variationOptionMapper.toVariationOption(optionDTO);
                        option.setVariation(variation);
                        options.add(option);
                    }
                }
                variation.setVariationOptions(options);
                variations.add(variation);
            }
        }
        product.setVariations(variations);

        Product savedProduct = productRepository.save(product);

        // Create and link ProductItems
        List<ProductItem> productItems = new ArrayList<>();
        int totalQuantity = 0;

        if (request.getProductItems() != null) {
            for (ProductItemRequest itemDTO : request.getProductItems()) {
                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
                productItem.setProduct(savedProduct);

                // Link VariationOptions to ProductItem based on values
                List<VariationOption> itemOptions = new ArrayList<>();
                if (itemDTO.getVariationOptionValues() != null) {
                    for (String optionValue : itemDTO.getVariationOptionValues()) {
                        // Find the VariationOption by value and linked to one of the product's variations
                        // This assumes VariationOptions have been saved with the product due to cascade
                        VariationOption option = savedProduct.getVariations().stream()
                                .flatMap(v -> v.getVariationOptions().stream())
                                .filter(vo -> vo.getValue() != null
                                        && vo.getValue().equalsIgnoreCase(optionValue)) // Keep case-insensitive search
                                .findFirst()
                                .orElseThrow(() ->
                                        new RuntimeException("Variation Option not found with value: " + optionValue));
                        itemOptions.add(option);
                    }
                }
                productItem.setVariationOptions(itemOptions);

                MultipartFile itemThumbnailFile = itemDTO.getThumbnailFiles();
                if (itemThumbnailFile != null && !itemThumbnailFile.isEmpty()) {
                    try {
                        String itemThumbnailUrl = cloudinaryService.uploadFile(itemThumbnailFile);
                        productItem.setThumbnail(itemThumbnailUrl);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to upload product item thumbnail", e);
                    }
                }

                productItems.add(productItem);
                totalQuantity += productItem.getQuantityInStock();
            }
        }
        savedProduct.setProductItems(productItems);

        savedProduct.setQuantityInStock(totalQuantity);

        // Save ProductItems (assuming cascade is not configured from Product to ProductItem)
        productItemRepository.saveAll(productItems);

        productRepository.save(savedProduct);

        return productMapper.toProductResponse(savedProduct);
    }

    @Override
    public Page<ProductResponse> getSellerProducts(int pageNumber, int pageSize) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        Page<Product> productsPage = productRepository.findByShop_User_Username(username, pageable);
        return productsPage.map(productMapper::toProductResponse);
    }
}
