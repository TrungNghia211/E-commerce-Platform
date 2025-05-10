package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.request.PermissionRequest;
import com.finalthesis.ecommerce.dto.response.PermissionResponse;

import java.util.List;

public interface PermissionService {

    PermissionResponse createPermission(PermissionRequest request);

    List<PermissionResponse> getAllPermissions();

}
