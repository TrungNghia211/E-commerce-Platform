package com.finalthesis.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.finalthesis.ecommerce.constant.PredefinedRole;
import com.finalthesis.ecommerce.dto.request.UserCreationRequest;
import com.finalthesis.ecommerce.dto.response.UserResponse;
import com.finalthesis.ecommerce.entity.Role;
import com.finalthesis.ecommerce.entity.User;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.UserMapper;
import com.finalthesis.ecommerce.repository.RoleRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.EMAIL_EXISTED);
        else if (userRepository.existsByPhone(request.getPhone())) throw new AppException(ErrorCode.PHONE_EXISTED);

        User user = userMapper.toUser(request);

        Role userRole = roleRepository
                .findById(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.setRoles(Set.of(userRole));

        user.setCreatedAt(LocalDateTime.now());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .build();
    }
}
