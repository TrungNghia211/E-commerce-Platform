package com.finalthesis.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.RoleRequest;
import com.finalthesis.ecommerce.dto.response.ApiResponse;
import com.finalthesis.ecommerce.dto.response.RoleResponse;
import com.finalthesis.ecommerce.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .build();
    }

    //    @GetMapping
    //    ApiResponse<List<RoleResponse>> getAllRoles() {
    //        return ApiResponse.<List<RoleResponse>>builder()
    //                          .result(roleService.getAllRoles())
    //                          .build();
    //    }

}
