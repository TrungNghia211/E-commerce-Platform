package com.finalthesis.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.AuthenticationRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.AuthenticationResponse;
import com.finalthesis.ecommerce.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> isAuthenticated(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse result = authenticationService.isAuthenticated(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
}
