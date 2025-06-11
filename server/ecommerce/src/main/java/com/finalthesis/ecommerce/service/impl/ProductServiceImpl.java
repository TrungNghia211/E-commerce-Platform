package com.finalthesis.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

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
import com.finalthesis.ecommerce.dto.response.productdetail.ProductDetailResponse;
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
import com.finalthesis.ecommerce.utils.ProductMapperManual;

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

    //    @Override
    //    @Transactional
    //    public ProductResponse createProduct(ProductCreationRequest request) {
    //        String username = SecurityContextHolder.getContext().getAuthentication().getName();
    //        User user =
    //                userRepository.findByUsername(username).orElseThrow(() -> new
    // AppException(ErrorCode.USER_NOT_EXISTED));
    //
    //        ProductCategory category = productCategoryRepository
    //                .findById(request.getCategoryId())
    //                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));
    //
    //        Shop shop = user.getShop();
    //
    //        Product product = productMapper.toProduct(request);
    //        product.setCategory(category);
    //        product.setShop(shop);
    //
    //        MultipartFile productThumbnailFile = request.getThumbnail();
    //        if (productThumbnailFile != null && !productThumbnailFile.isEmpty())
    //            try {
    //                String thumbnailUrl = cloudinaryService.uploadFile(productThumbnailFile);
    //                product.setThumbnail(thumbnailUrl);
    //            } catch (Exception e) {
    //                throw new RuntimeException("Failed to upload product thumbnail", e);
    //            }
    //
    //        // Create and link Variations and VariationOptions
    //        Set<Variation> variations = new HashSet<>();
    //        if (request.getVariations() != null) {
    //            for (VariationCreationRequest variationDTO : request.getVariations()) {
    //                Variation variation = variationMapper.toVariation(variationDTO);
    //                variation.setProduct(product);
    //
    //                Set<VariationOption> options = new HashSet<>();
    //                if (variationDTO.getOptions() != null) {
    //                    for (VariationOptionRequest optionDTO : variationDTO.getOptions()) {
    //                        VariationOption option = variationOptionMapper.toVariationOption(optionDTO);
    //                        option.setVariation(variation);
    //                        options.add(option);
    //                    }
    //                }
    //                variation.setVariationOptions(options);
    //                variations.add(variation);
    //            }
    //        }
    //        product.setVariations(variations);
    //
    //        Product savedProduct = productRepository.save(product);
    //
    //        // Create and link ProductItems
    //        Set<ProductItem> productItems = new HashSet<>();
    //        int totalQuantity = 0;
    //
    //        if (request.getProductItems() != null) {
    //            for (ProductItemRequest itemDTO : request.getProductItems()) {
    //                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
    //                productItem.setProduct(savedProduct);
    //
    //                // Link VariationOptions to ProductItem based on values
    //                Set<VariationOption> itemOptions = new HashSet<>();
    //                if (itemDTO.getVariationOptionValues() != null) {
    //                    for (String optionValue : itemDTO.getVariationOptionValues()) {
    //                        // Find the VariationOption by value and linked to one of the product's variations
    //                        // This assumes VariationOptions have been saved with the product due to cascade
    //                        VariationOption option = savedProduct.getVariations().stream()
    //                                .flatMap(v -> v.getVariationOptions().stream())
    //                                .filter(vo -> vo.getValue() != null
    //                                        && vo.getValue().equalsIgnoreCase(optionValue)) // Keep case-insensitive
    // search
    //                                .findFirst()
    //                                .orElseThrow(() ->
    //                                        new RuntimeException("Variation Option not found with value: " +
    // optionValue));
    //                        itemOptions.add(option);
    //                    }
    //                }
    //                productItem.setVariationOptions(itemOptions);
    //
    //                MultipartFile itemThumbnailFile = itemDTO.getThumbnailFiles();
    //                if (itemThumbnailFile != null && !itemThumbnailFile.isEmpty()) {
    //                    try {
    //                        String itemThumbnailUrl = cloudinaryService.uploadFile(itemThumbnailFile);
    //                        productItem.setThumbnail(itemThumbnailUrl);
    //                    } catch (Exception e) {
    //                        throw new RuntimeException("Failed to upload product item thumbnail", e);
    //                    }
    //                }
    //
    //                productItems.add(productItem);
    //                totalQuantity += productItem.getQuantityInStock();
    //            }
    //        }
    //        savedProduct.setProductItems(productItems);
    //
    //        savedProduct.setQuantityInStock(totalQuantity);
    //
    //        // Save ProductItems (assuming cascade is not configured from Product to ProductItem)
    //        productItemRepository.saveAll(productItems);
    //
    //        productRepository.save(savedProduct);
    //
    //        return productMapper.toProductResponse(savedProduct);
    //    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreationRequest request) {
        // 1. Lấy user, category, shop
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ProductCategory category = productCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));

        Shop shop = user.getShop();

        // 2. Map DTO -> entity Product, set quan hệ
        Product product = productMapper.toProduct(request);
        product.setCategory(category);
        product.setShop(shop);

        // 3. Create and link Variations and VariationOptions
        Set<Variation> variations = new HashSet<>();
        if (request.getVariations() != null) {
            for (VariationCreationRequest variationDTO : request.getVariations()) {
                Variation variation = variationMapper.toVariation(variationDTO);
                variation.setProduct(product);

                Set<VariationOption> options = new HashSet<>();
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

        // 4. Save product first to get variations with IDs
        Product savedProduct = productRepository.save(product);

        // 5. Tạo ProductItems và prepare for parallel upload
        List<ProductItem> productItems = new ArrayList<>();
        int totalQuantity = 0;

        if (request.getProductItems() != null) {
            for (ProductItemRequest itemDTO : request.getProductItems()) {
                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
                productItem.setProduct(savedProduct);

                // Link VariationOptions to ProductItem based on values
                Set<VariationOption> itemOptions = new HashSet<>();
                if (itemDTO.getVariationOptionValues() != null) {
                    for (String optionValue : itemDTO.getVariationOptionValues()) {
                        VariationOption option = savedProduct.getVariations().stream()
                                .flatMap(v -> v.getVariationOptions().stream())
                                .filter(vo ->
                                        vo.getValue() != null && vo.getValue().equalsIgnoreCase(optionValue))
                                .findFirst()
                                .orElseThrow(() ->
                                        new RuntimeException("Variation Option not found with value: " + optionValue));
                        itemOptions.add(option);
                    }
                }
                productItem.setVariationOptions(itemOptions);

                productItems.add(productItem);
                totalQuantity += productItem.getQuantityInStock();
            }
        }

        // 6. Upload ảnh song song - thumbnail chính + thumbnails của items
        CompletableFuture<String> productThumbnailFuture = null;
        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            productThumbnailFuture = cloudinaryService
                    .uploadFileAsync(request.getThumbnail())
                    .exceptionally(ex -> {
                        throw new RuntimeException("Failed to upload product thumbnail", ex);
                    });
        }

        List<CompletableFuture<Void>> itemThumbnailFutures = new ArrayList<>();
        for (int i = 0; i < productItems.size(); i++) {
            if (i < request.getProductItems().size()) {
                MultipartFile itemThumbnailFile =
                        request.getProductItems().get(i).getThumbnailFiles();
                if (itemThumbnailFile != null && !itemThumbnailFile.isEmpty()) {
                    ProductItem currentItem = productItems.get(i);
                    CompletableFuture<Void> itemFuture = cloudinaryService
                            .uploadFileAsync(itemThumbnailFile)
                            .thenAccept(currentItem::setThumbnail)
                            .exceptionally(ex -> {
                                throw new RuntimeException("Failed to upload product item thumbnail", ex);
                            });
                    itemThumbnailFutures.add(itemFuture);
                }
            }
        }

        // 7. Chờ tất cả upload hoàn thành
        List<CompletableFuture<?>> allUploadTasks = new ArrayList<>(itemThumbnailFutures);
        if (productThumbnailFuture != null) {
            allUploadTasks.add(productThumbnailFuture.thenAccept(savedProduct::setThumbnail));
        }

        if (!allUploadTasks.isEmpty()) {
            try {
                CompletableFuture.allOf(allUploadTasks.toArray(new CompletableFuture[0]))
                        .join();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload images", e);
            }
        }

        // 8. Set ProductItems và tổng quantity
        savedProduct.setProductItems(new HashSet<>(productItems));
        savedProduct.setQuantityInStock(totalQuantity);

        // 9. Save ProductItems và update Product
        if (!productItems.isEmpty()) {
            productItemRepository.saveAll(productItems);
        }
        productRepository.save(savedProduct);

        return productMapper.toProductResponse(savedProduct);
    }

    @Override
    public Page<ProductResponse> getSellerProducts(int pageNumber, int pageSize) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Product> productsPage = productRepository.findByShop_User_Username(username, pageable);
        return productsPage.map(product -> {
            ProductResponse dto = productMapper.toProductResponse(product);
            if (product.getCategory() != null)
                dto.setCategoryName(product.getCategory().getName());
            return dto;
        });
    }

    @Override
    public ProductDetailResponse getProductDetailById(Integer productId) {
        Product product = productRepository
                .findWithAllDetailsById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return ProductMapperManual.toProductDetailResponse(product);
    }

    //    @Override
    //    @Transactional
    //    public ProductResponse updateProduct(Integer productId, ProductCreationRequest request) {
    //        String username = SecurityContextHolder.getContext().getAuthentication().getName();
    //        User user =
    //                userRepository.findByUsername(username).orElseThrow(() -> new
    // AppException(ErrorCode.USER_NOT_EXISTED));
    //
    //        Product existingProduct =
    //                productRepository.findById(productId).orElseThrow(() -> new
    // AppException(ErrorCode.PRODUCT_NOT_FOUND));
    //
    //        // Verify product belongs to seller
    //        if (!existingProduct.getShop().getUser().getUsername().equals(username)) {
    //            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
    //        }
    //
    //        ProductCategory category = productCategoryRepository
    //                .findById(request.getCategoryId())
    //                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));
    //
    //        // Update basic product info
    //        existingProduct.setName(request.getName());
    //        existingProduct.setSlug(request.getSlug());
    //        existingProduct.setDescription(request.getDescription());
    //        existingProduct.setCategory(category);
    //        existingProduct.setWeight(request.getWeight());
    //        existingProduct.setWidth(request.getWidth());
    //        existingProduct.setLength(request.getLength());
    //        existingProduct.setHeight(request.getHeight());
    //
    //        // Update thumbnail if provided
    //        MultipartFile productThumbnailFile = request.getThumbnail();
    //        if (productThumbnailFile != null && !productThumbnailFile.isEmpty()) {
    //            try {
    //                String thumbnailUrl = cloudinaryService.uploadFile(productThumbnailFile);
    //                existingProduct.setThumbnail(thumbnailUrl);
    //            } catch (Exception e) {
    //                throw new RuntimeException("Failed to upload product thumbnail", e);
    //            }
    //        }
    //
    //        // Update variations and options
    //        if (request.getVariations() != null) {
    //            // Remove existing variations and options
    //            existingProduct.getVariations().clear();
    //
    //            // Add new variations and options
    //            Set<Variation> variations = new HashSet<>();
    //            for (VariationCreationRequest variationDTO : request.getVariations()) {
    //                Variation variation = variationMapper.toVariation(variationDTO);
    //                variation.setProduct(existingProduct);
    //
    //                Set<VariationOption> options = new HashSet<>();
    //                if (variationDTO.getOptions() != null) {
    //                    for (VariationOptionRequest optionDTO : variationDTO.getOptions()) {
    //                        VariationOption option = variationOptionMapper.toVariationOption(optionDTO);
    //                        option.setVariation(variation);
    //                        options.add(option);
    //                    }
    //                }
    //                variation.setVariationOptions(options);
    //                variations.add(variation);
    //            }
    //            existingProduct.setVariations(variations);
    //        }
    //
    //        Product savedProduct = productRepository.save(existingProduct);
    //
    //        // Update product items
    //        if (request.getProductItems() != null) {
    //            // Remove existing product items
    //            existingProduct.getProductItems().clear();
    //
    //            Set<ProductItem> productItems = new HashSet<>();
    //            int totalQuantity = 0;
    //
    //            for (ProductItemRequest itemDTO : request.getProductItems()) {
    //                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
    //                productItem.setProduct(savedProduct);
    //
    //                // Link VariationOptions
    //                Set<VariationOption> itemOptions = new HashSet<>();
    //                if (itemDTO.getVariationOptionValues() != null) {
    //                    for (String optionValue : itemDTO.getVariationOptionValues()) {
    //                        VariationOption option = savedProduct.getVariations().stream()
    //                                .flatMap(v -> v.getVariationOptions().stream())
    //                                .filter(vo -> vo.getValue().equalsIgnoreCase(optionValue))
    //                                .findFirst()
    //                                .orElseThrow(() -> new RuntimeException("Variation Option not found: " +
    // optionValue));
    //                        itemOptions.add(option);
    //                    }
    //                }
    //                productItem.setVariationOptions(itemOptions);
    //
    //                // Update thumbnail if provided
    //                MultipartFile itemThumbnailFile = itemDTO.getThumbnailFiles();
    //                if (itemThumbnailFile != null && !itemThumbnailFile.isEmpty()) {
    //                    try {
    //                        String itemThumbnailUrl = cloudinaryService.uploadFile(itemThumbnailFile);
    //                        productItem.setThumbnail(itemThumbnailUrl);
    //                    } catch (Exception e) {
    //                        throw new RuntimeException("Failed to upload product item thumbnail", e);
    //                    }
    //                }
    //
    //                productItems.add(productItem);
    //                totalQuantity += productItem.getQuantityInStock();
    //            }
    //
    //            savedProduct.setProductItems(productItems);
    //            savedProduct.setQuantityInStock(totalQuantity);
    //            productItemRepository.saveAll(productItems);
    //        }
    //
    //        return productMapper.toProductResponse(productRepository.save(savedProduct));
    //    }

    //    @Override
    //    @Transactional
    //    public ProductResponse updateProduct(Integer productId, ProductCreationRequest request) {
    //        String username = SecurityContextHolder.getContext().getAuthentication().getName();
    //        User user =
    //                userRepository.findByUsername(username).orElseThrow(() -> new
    // AppException(ErrorCode.USER_NOT_EXISTED));
    //
    //        // Load product with all details to avoid lazy loading issues
    //        Product existingProduct = productRepository
    //                .findWithAllDetailsById(productId)
    //                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    //
    //        // Verify product belongs to seller
    //        if (!existingProduct.getShop().getUser().getUsername().equals(username))
    //            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
    //
    //        ProductCategory category = productCategoryRepository
    //                .findById(request.getCategoryId())
    //                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));
    //
    //        // Store old thumbnail URL for potential cleanup
    //        String oldThumbnailUrl = existingProduct.getThumbnail();
    //
    //        // Update basic product info
    //        existingProduct.setName(request.getName());
    //        existingProduct.setSlug(request.getSlug());
    //        existingProduct.setDescription(request.getDescription());
    //        existingProduct.setCategory(category);
    //        existingProduct.setWeight(request.getWeight());
    //        existingProduct.setWidth(request.getWidth());
    //        existingProduct.setLength(request.getLength());
    //        existingProduct.setHeight(request.getHeight());
    //
    //        // Update price for products without variations
    //        if (request.getPrice() != null) existingProduct.setPrice(request.getPrice());
    //
    //        // Update thumbnail if provided
    //        MultipartFile productThumbnailFile = request.getThumbnail();
    //        if (productThumbnailFile != null && !productThumbnailFile.isEmpty()) {
    //            try {
    //                String thumbnailUrl = cloudinaryService.uploadFile(productThumbnailFile);
    //                existingProduct.setThumbnail(thumbnailUrl);
    //
    //                // Optional: Delete old thumbnail from cloudinary
    //                if (oldThumbnailUrl != null && !oldThumbnailUrl.isEmpty()) {
    //                    // cloudinaryService.deleteFile(oldThumbnailUrl);
    //                }
    //            } catch (Exception e) {
    //                throw new RuntimeException("Failed to upload product thumbnail", e);
    //            }
    //        }
    //
    //        // Don't clear - directly replace collections to let orphanRemoval work properly
    //
    //        // Update variations and options - direct replacement
    //        updateVariations(existingProduct, request.getVariations());
    //
    //        // Save product first to get updated variations with IDs
    //        Product savedProduct = productRepository.save(existingProduct);
    //
    //        // Update product items - direct replacement
    //        updateProductItems(savedProduct, request.getProductItems());
    //
    //        // Calculate and update total quantity
    //        int totalQuantity = savedProduct.getProductItems().stream()
    //                .mapToInt(ProductItem::getQuantityInStock)
    //                .sum();
    //        savedProduct.setQuantityInStock(totalQuantity);
    //
    //        return productMapper.toProductResponse(productRepository.save(savedProduct));
    //    }
    //
    //    private void clearExistingRelationships(Product product) {
    //        // Clear product items first (due to foreign key constraints)
    //        if (product.getProductItems() != null) {
    //            product.getProductItems().clear();
    //        }
    //
    //        // Clear variations and their options
    //        if (product.getVariations() != null) {
    //            product.getVariations().forEach(variation -> {
    //                if (variation.getVariationOptions() != null) {
    //                    variation.getVariationOptions().clear();
    //                }
    //            });
    //            product.getVariations().clear();
    //        }
    //    }
    //
    //    private void updateVariations(Product product, List<VariationCreationRequest> variationRequests) {
    //        Set<Variation> newVariations = new HashSet<>();
    //
    //        if (variationRequests != null && !variationRequests.isEmpty()) {
    //            for (VariationCreationRequest variationDTO : variationRequests) {
    //                Variation variation = variationMapper.toVariation(variationDTO);
    //                variation.setProduct(product);
    //
    //                Set<VariationOption> options = new HashSet<>();
    //                if (variationDTO.getOptions() != null) {
    //                    for (VariationOptionRequest optionDTO : variationDTO.getOptions()) {
    //                        VariationOption option = variationOptionMapper.toVariationOption(optionDTO);
    //                        option.setVariation(variation);
    //                        options.add(option);
    //                    }
    //                }
    //                variation.setVariationOptions(options);
    //                newVariations.add(variation);
    //            }
    //        }
    //
    //        // Direct replacement - let orphanRemoval handle the old ones
    //        product.setVariations(newVariations);
    //    }
    //
    //    private void updateProductItems(Product product, List<ProductItemRequest> productItemRequests) {
    //        Set<ProductItem> newProductItems = new HashSet<>();
    //
    //        if (productItemRequests != null && !productItemRequests.isEmpty()) {
    //            for (ProductItemRequest itemDTO : productItemRequests) {
    //                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
    //                productItem.setProduct(product);
    //
    //                // Link VariationOptions to ProductItem
    //                linkVariationOptions(productItem, itemDTO.getVariationOptionValues(), product);
    //
    //                // Handle thumbnail upload for product item
    //                handleProductItemThumbnail(productItem, itemDTO.getThumbnailFiles());
    //
    //                newProductItems.add(productItem);
    //            }
    //        }
    //
    //        // Direct replacement - let orphanRemoval handle the old ones
    //        product.setProductItems(newProductItems);
    //    }
    //
    //    private void linkVariationOptions(ProductItem productItem, List<String> optionValues, Product product) {
    //        if (optionValues != null && !optionValues.isEmpty()) {
    //            Set<VariationOption> itemOptions = new HashSet<>();
    //
    //            for (String optionValue : optionValues) {
    //                VariationOption option = product.getVariations().stream()
    //                        .flatMap(v -> v.getVariationOptions().stream())
    //                        .filter(vo -> vo.getValue() != null && vo.getValue().equalsIgnoreCase(optionValue))
    //                        .findFirst()
    //                        .orElseThrow(() -> new AppException(ErrorCode.VARIATION_OPTION_NOT_FOUND));
    //                itemOptions.add(option);
    //            }
    //            productItem.setVariationOptions(itemOptions);
    //        }
    //    }
    //
    //    private void handleProductItemThumbnail(ProductItem productItem, MultipartFile thumbnailFile) {
    //        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
    //            try {
    //                String itemThumbnailUrl = cloudinaryService.uploadFile(thumbnailFile);
    //                productItem.setThumbnail(itemThumbnailUrl);
    //            } catch (Exception e) {
    //                throw new RuntimeException("Failed to upload product item thumbnail", e);
    //            }
    //        }
    //    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Integer productId, ProductCreationRequest request) {
        // 1. Validation và load existing product
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product existingProduct = productRepository
                .findWithAllDetailsById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Verify product belongs to seller
        if (!existingProduct.getShop().getUser().getUsername().equals(username))
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);

        ProductCategory category = productCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));

        // 2. Update basic product info (chưa save)
        existingProduct.setName(request.getName());
        existingProduct.setSlug(request.getSlug());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setCategory(category);
        existingProduct.setWeight(request.getWeight());
        existingProduct.setWidth(request.getWidth());
        existingProduct.setLength(request.getLength());
        existingProduct.setHeight(request.getHeight());

        if (request.getPrice() != null) existingProduct.setPrice(request.getPrice());

        // 3. Prepare new variations (chưa set vào product)
        Set<Variation> newVariations = prepareVariations(existingProduct, request.getVariations());

        // 4. Prepare new product items (chưa set vào product)
        List<ProductItem> newProductItems = prepareProductItems(existingProduct, request.getProductItems());

        // 5. Prepare parallel uploads
        List<CompletableFuture<?>> uploadTasks = new ArrayList<>();
        List<String> uploadResults = new ArrayList<>();

        // Upload product thumbnail
        CompletableFuture<String> productThumbnailFuture = null;
        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            productThumbnailFuture = cloudinaryService
                    .uploadFileAsync(request.getThumbnail())
                    .exceptionally(ex -> {
                        throw new RuntimeException("Failed to upload product thumbnail", ex);
                    });
            uploadTasks.add(productThumbnailFuture);
        }

        // Upload product item thumbnails
        List<CompletableFuture<String>> itemThumbnailFutures = new ArrayList<>();
        if (request.getProductItems() != null) {
            for (int i = 0; i < request.getProductItems().size(); i++) {
                MultipartFile thumbnailFile = request.getProductItems().get(i).getThumbnailFiles();
                if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                    CompletableFuture<String> itemFuture = cloudinaryService
                            .uploadFileAsync(thumbnailFile)
                            .exceptionally(ex -> {
                                throw new RuntimeException("Failed to upload product item thumbnail", ex);
                            });
                    itemThumbnailFutures.add(itemFuture);
                    uploadTasks.add(itemFuture);
                } else {
                    itemThumbnailFutures.add(null); // Maintain index alignment
                }
            }
        }

        // 6. Execute all uploads in parallel
        if (!uploadTasks.isEmpty()) {
            try {
                CompletableFuture.allOf(uploadTasks.toArray(new CompletableFuture[0]))
                        .join();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload images", e);
            }
        }

        // 7. Apply upload results
        if (productThumbnailFuture != null) {
            try {
                existingProduct.setThumbnail(productThumbnailFuture.get());
            } catch (Exception e) {
                throw new RuntimeException("Failed to get product thumbnail URL", e);
            }
        }

        // Apply item thumbnail URLs
        if (request.getProductItems() != null) {
            for (int i = 0; i < newProductItems.size() && i < itemThumbnailFutures.size(); i++) {
                CompletableFuture<String> future = itemThumbnailFutures.get(i);
                if (future != null) {
                    try {
                        newProductItems.get(i).setThumbnail(future.get());
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to get product item thumbnail URL", e);
                    }
                }
            }
        }

        // 8. Link variation options to product items
        linkVariationOptionsToItems(newProductItems, newVariations, request.getProductItems());

        // 9. Calculate total quantity
        int totalQuantity = newProductItems.stream()
                .mapToInt(ProductItem::getQuantityInStock)
                .sum();
        existingProduct.setQuantityInStock(totalQuantity);

        // 10. Replace relationships atomically
        existingProduct.getVariations().clear();
        existingProduct.getVariations().addAll(newVariations);

        existingProduct.getProductItems().clear();
        existingProduct.getProductItems().addAll(newProductItems);

        //        existingProduct.setVariations(newVariations);

        //        existingProduct.setProductItems(new HashSet<>(newProductItems));

        // 11. Single save operation
        return productMapper.toProductResponse(productRepository.save(existingProduct));
    }

    private Set<Variation> prepareVariations(Product product, List<VariationCreationRequest> variationRequests) {
        Set<Variation> newVariations = new HashSet<>();

        if (variationRequests != null && !variationRequests.isEmpty()) {
            for (VariationCreationRequest variationDTO : variationRequests) {
                Variation variation = variationMapper.toVariation(variationDTO);
                variation.setProduct(product);

                Set<VariationOption> options = new HashSet<>();
                if (variationDTO.getOptions() != null) {
                    for (VariationOptionRequest optionDTO : variationDTO.getOptions()) {
                        VariationOption option = variationOptionMapper.toVariationOption(optionDTO);
                        option.setVariation(variation);
                        options.add(option);
                    }
                }
                variation.setVariationOptions(options);
                newVariations.add(variation);
            }
        }

        return newVariations;
    }

    private List<ProductItem> prepareProductItems(Product product, List<ProductItemRequest> productItemRequests) {
        List<ProductItem> newProductItems = new ArrayList<>();

        if (productItemRequests != null && !productItemRequests.isEmpty()) {
            for (ProductItemRequest itemDTO : productItemRequests) {
                ProductItem productItem = productItemMapper.toProductItem(itemDTO);
                productItem.setProduct(product);
                newProductItems.add(productItem);
            }
        }

        return newProductItems;
    }

    private void linkVariationOptionsToItems(
            List<ProductItem> productItems, Set<Variation> variations, List<ProductItemRequest> itemRequests) {
        if (itemRequests == null || productItems.isEmpty()) return;

        for (int i = 0; i < productItems.size() && i < itemRequests.size(); i++) {
            ProductItem productItem = productItems.get(i);
            List<String> optionValues = itemRequests.get(i).getVariationOptionValues();

            if (optionValues != null && !optionValues.isEmpty()) {
                Set<VariationOption> itemOptions = new HashSet<>();

                for (String optionValue : optionValues) {
                    VariationOption option = variations.stream()
                            .flatMap(v -> v.getVariationOptions().stream())
                            .filter(vo -> vo.getValue() != null && vo.getValue().equalsIgnoreCase(optionValue))
                            .findFirst()
                            .orElseThrow(() -> new AppException(ErrorCode.VARIATION_OPTION_NOT_FOUND));
                    itemOptions.add(option);
                }

                productItem.setVariationOptions(itemOptions);
            }
        }
    }

    @Override
    @Transactional
    public void deleteProduct(Integer productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Product product =
                productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Verify product belongs to seller
        if (!product.getShop().getUser().getUsername().equals(username))
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);

        productRepository.delete(product);
    }

    @Override
    public ProductDetailResponse getSellerProductDetail(Integer productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Product product = productRepository
                .findWithAllDetailsById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Verify product belongs to seller
        if (!product.getShop().getUser().getUsername().equals(username))
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);

        return ProductMapperManual.toProductDetailResponse(product);
    }

    @Override
    public Page<HomepageProductResponse> searchProducts(String keyword, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        return productRepository
                .findByNameContainingIgnoreCase(keyword, pageable)
                .map(product -> {
                    HomepageProductResponse response = new HomepageProductResponse();
                    response.setId(product.getId());
                    response.setName(product.getName());
                    response.setPrice(product.getPrice());
                    response.setThumbnail(product.getThumbnail());
                    response.setBuyTurn(product.getBuyTurn());
                    return response;
                });
    }
}
