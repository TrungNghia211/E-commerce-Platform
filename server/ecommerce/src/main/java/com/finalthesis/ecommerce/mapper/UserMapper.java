package com.finalthesis.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.finalthesis.ecommerce.dto.request.UserCreationRequest;
import com.finalthesis.ecommerce.dto.response.UserResponse;
import com.finalthesis.ecommerce.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);
}
