package com.finalthesis.ecommerce.service;

import java.util.List;

import com.finalthesis.ecommerce.dto.request.PermissionRequest;
import com.finalthesis.ecommerce.dto.response.PermissionResponse;

public interface PermissionService {

    PermissionResponse createPermission(PermissionRequest request);

    List<PermissionResponse> getAllPermissions();
}
