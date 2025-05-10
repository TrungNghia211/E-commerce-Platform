package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.request.UserCreationRequest;
import com.finalthesis.ecommerce.dto.response.UserResponse;

public interface UserService {

    UserResponse createUser(UserCreationRequest user);
}
