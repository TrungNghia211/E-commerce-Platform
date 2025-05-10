package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.finalthesis.ecommerce.dto.request.PermissionRequest;
import com.finalthesis.ecommerce.dto.response.PermissionResponse;
import com.finalthesis.ecommerce.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
