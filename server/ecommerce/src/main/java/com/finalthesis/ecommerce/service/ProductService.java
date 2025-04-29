package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import org.springframework.data.domain.Page;

public interface ProductService {

    Page<HomepageProductResponse> getHomepageProducts(int pageNumber, int pageSize);

}
