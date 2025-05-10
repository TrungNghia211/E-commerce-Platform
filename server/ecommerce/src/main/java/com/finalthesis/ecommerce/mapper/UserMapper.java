package com.finalthesis.ecommerce.mapper;

import com.finalthesis.ecommerce.dto.request.UserCreationRequest;
import com.finalthesis.ecommerce.dto.response.UserResponse;
import com.finalthesis.ecommerce.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

}
