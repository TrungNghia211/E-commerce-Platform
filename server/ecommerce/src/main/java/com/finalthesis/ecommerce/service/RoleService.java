package com.finalthesis.ecommerce.service;

import java.util.List;

import com.finalthesis.ecommerce.dto.request.RoleRequest;
import com.finalthesis.ecommerce.dto.response.RoleResponse;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRoles();
}
