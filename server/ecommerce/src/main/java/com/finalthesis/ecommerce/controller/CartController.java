package com.finalthesis.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.AddToCartRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.CartItemResponse;
import com.finalthesis.ecommerce.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @PostMapping("/add")
    public ApiResponse<String> addToCart(@RequestBody AddToCartRequest request) {
        cartService.addToCart(request);
        return ApiResponse.<String>builder()
                .result("Thêm sản phẩm vào giỏ hàng thành công")
                .build();
    }

    @GetMapping
    public ApiResponse<List<CartItemResponse>> getCartItems() {
        List<CartItemResponse> cartItems = cartService.getCartItems();
        return ApiResponse.<List<CartItemResponse>>builder().result(cartItems).build();
    }

    //    @DeleteMapping("/{cartId}")
    //    public ResponseEntity<ApiResponse<String>> removeFromCart(@PathVariable Integer cartId) {
    //        cartService.removeFromCart(cartId);
    //        return ResponseEntity.ok(ApiResponse.<String>builder()
    //                .message("Xóa sản phẩm khỏi giỏ hàng thành công")
    //                .build());
    //    }
}
