package com.finalthesis.ecommerce.mapper;

import com.finalthesis.ecommerce.dto.request.RoleRequest;
import com.finalthesis.ecommerce.dto.response.RoleResponse;
import com.finalthesis.ecommerce.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

}
