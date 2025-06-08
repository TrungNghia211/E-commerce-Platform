package com.finalthesis.ecommerce.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.finalthesis.ecommerce.dto.request.AddToCartRequest;
import com.finalthesis.ecommerce.dto.response.CartItemResponse;
import com.finalthesis.ecommerce.entity.*;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.repository.CartItemRepository;
import com.finalthesis.ecommerce.repository.CartRepository;
import com.finalthesis.ecommerce.repository.ProductItemRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    UserRepository userRepository;
    ProductItemRepository productItemRepository;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;

    @Override
    public void addToCart(AddToCartRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = getOrCreateCartForUser(user);

        ProductItem productItem = productItemRepository
                .findById(request.getProductItemId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND));

        if (request.getQuantity() <= 0) throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        if (request.getQuantity() > productItem.getQuantityInStock())
            throw new IllegalArgumentException("Số lượng vượt quá tồn kho");

        Set<CartItem> cartItems = cart.getItems();
        if (cartItems == null) {
            cartItems = new HashSet<>();
            cart.setItems(cartItems);
        }

        // Kiểm tra xem đã tồn tại CartItem cho ProductItem này hay chưa
        Optional<CartItem> existing = cartItems.stream()
                .filter(ci -> ci.getProductItem().getId().equals(productItem.getId()))
                .findFirst();

        if (existing.isPresent()) {
            // Nếu tồn tại, cộng dồn số lượng
            CartItem cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            // Nếu không tồn tại, tạo mới CartItem và thêm vào giỏ
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productItem(productItem)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
    }

    @Override
    public List<CartItemResponse> getCartItems() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = getOrCreateCartForUser(user);

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        return cartItems.stream().map(this::convertToCartItemResponse).collect(Collectors.toList());
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
        ProductItem productItem = cartItem.getProductItem();
        Product product = productItem.getProduct();
        Shop shop = product.getShop();

        // Format variations thành string có định dạng đẹp
        String formattedVariations = formatVariations(productItem);

        return CartItemResponse.builder()
                .cartId(cartItem.getId())
                .productItemId(productItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .thumbnail(
                        productItem.getThumbnail() != null
                                ? productItem.getThumbnail()
                                : product.getThumbnail()) // Fallback to product thumbnail
                .variations(formattedVariations)
                .price(productItem.getPrice())
                .quantity(cartItem.getQuantity())
                .quantityInStock(productItem.getQuantityInStock())
                .shopName(shop.getName())
                .shopId(shop.getId())
                .totalPrice(cartItem.getQuantity() * productItem.getPrice())
                .build();
    }

    private String formatVariations(ProductItem productItem) {
        Set<VariationOption> variationOptions = productItem.getVariationOptions();

        if (variationOptions == null || variationOptions.isEmpty()) return ""; // Không có biến thể

        // Group variation options by variation name
        Map<String, String> variationMap = variationOptions.stream()
                .collect(Collectors.toMap(
                        option -> option.getVariation().getName(),
                        VariationOption::getValue,
                        (existing, replacement) -> existing // Trong trường hợp duplicate key
                        ));

        // Format thành string: "Size: L, Màu sắc: Đỏ"
        return variationMap.entrySet().stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .collect(Collectors.joining(", "));
    }

    private Cart getOrCreateCartForUser(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }
}
