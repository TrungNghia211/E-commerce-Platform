package com.finalthesis.ecommerce.service;

import java.util.List;

import com.finalthesis.ecommerce.dto.request.AddToCartRequest;
import com.finalthesis.ecommerce.dto.response.CartItemResponse;

public interface CartService {
    void addToCart(AddToCartRequest request);

    List<CartItemResponse> getCartItems();
}
