package com.finalthesis.ecommerce.service.impl;

import com.finalthesis.ecommerce.dto.request.RoleRequest;
import com.finalthesis.ecommerce.dto.response.RoleResponse;
import com.finalthesis.ecommerce.entity.Permission;
import com.finalthesis.ecommerce.entity.Role;
import com.finalthesis.ecommerce.mapper.RoleMapper;
import com.finalthesis.ecommerce.repository.PermissionRepository;
import com.finalthesis.ecommerce.repository.RoleRepository;
import com.finalthesis.ecommerce.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {

    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @Override
    public RoleResponse createRole(RoleRequest request) {
        Role role = roleMapper.toRole(request);
        List<Permission> permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                             .stream()
                             .map(roleMapper::toRoleResponse)
                             .toList();
    }

}
