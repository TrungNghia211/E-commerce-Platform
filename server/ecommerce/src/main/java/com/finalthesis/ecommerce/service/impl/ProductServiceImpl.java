package com.finalthesis.ecommerce.service.impl;

import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.repository.ProductRepository;
import com.finalthesis.ecommerce.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {

    ProductRepository productRepository;

    public Page<HomepageProductResponse> getHomepageProducts(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        return productRepository.getHomepageProducts(pageable);
    }

}
