package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.request.RoleRequest;
import com.finalthesis.ecommerce.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRoles();

}
