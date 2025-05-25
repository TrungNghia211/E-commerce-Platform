package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.request.ShopCreationRequest;
import com.finalthesis.ecommerce.dto.response.ShopResponse;

public interface ShopService {
    ShopResponse createShop(ShopCreationRequest request);
}
