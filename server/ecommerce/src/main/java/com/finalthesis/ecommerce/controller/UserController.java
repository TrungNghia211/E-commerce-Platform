package com.finalthesis.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.UserCreationRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.UserResponse;
import com.finalthesis.ecommerce.service.UserService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }
    
    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe() {
        UserResponse userResponse = userService.getUserByUsername();
        return ApiResponse.<UserResponse>builder()
                    .result(userResponse)
                    .build();
    }
}
