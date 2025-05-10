package com.finalthesis.ecommerce.service.impl;

import com.finalthesis.ecommerce.dto.request.PermissionRequest;
import com.finalthesis.ecommerce.dto.response.PermissionResponse;
import com.finalthesis.ecommerce.entity.Permission;
import com.finalthesis.ecommerce.mapper.PermissionMapper;
import com.finalthesis.ecommerce.repository.PermissionRepository;
import com.finalthesis.ecommerce.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Override
    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    @Override
    public List<PermissionResponse> getAllPermissions() {
        List<Permission> permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }
}
