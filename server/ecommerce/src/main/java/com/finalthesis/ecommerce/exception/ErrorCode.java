package com.finalthesis.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1002, "Username existed", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1003, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1004, "Email existed", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1005, "Phone existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006, "User is not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You do not have permission", HttpStatus.FORBIDDEN),
    ROLE_NOT_FOUND(1009, "Role is not found", HttpStatus.NOT_FOUND),
    PRODUCT_CATEGORY_NAME_EXISTED(1010, "Product category name existed", HttpStatus.BAD_REQUEST),
    SLUG_EXISTED(1011, "Slug existed", HttpStatus.BAD_REQUEST),
    PRODUCT_CATEGORY_NOT_FOUND(1012, "Product Category is not found", HttpStatus.NOT_FOUND),
    FILE_UPLOAD_FAILED(1013, "File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    SHOP_NAME_EXISTED(1014, "Shop name existed", HttpStatus.BAD_REQUEST),
    VARIATION_OPTION_NOT_FOUND(1015, "Variation option not found", HttpStatus.NOT_FOUND),
    PRODUCT_ITEM_NOT_FOUND(1016, "Product item not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(1017, "Product not found", HttpStatus.NOT_FOUND),
    SHOP_NOT_FOUND(1018, "Shop not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1019, "Order not found", HttpStatus.NOT_FOUND),
    CART_NOT_FOUND(1020, "Cart not found", HttpStatus.NOT_FOUND),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
