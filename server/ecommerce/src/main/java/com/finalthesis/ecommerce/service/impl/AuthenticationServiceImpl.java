package com.finalthesis.ecommerce.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.finalthesis.ecommerce.dto.request.AuthenticationRequest;
import com.finalthesis.ecommerce.dto.response.AuthenticationResponse;
import com.finalthesis.ecommerce.dto.response.RoleResponse;
import com.finalthesis.ecommerce.entity.User;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.RoleMapper;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;

    PasswordEncoder passwordEncoder;

    RoleMapper roleMapper;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthenticationResponse isAuthenticated(AuthenticationRequest authenticationRequest) {
        var user = userRepository
                .findByUsername(authenticationRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isAuthenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());

        if (!isAuthenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        String token = generateToken(user);

        Set<RoleResponse> roleResponses =
                user.getRoles().stream().map(roleMapper::toRoleResponse).collect(Collectors.toSet());

        return AuthenticationResponse.builder()
                .token(token)
                .isAuthenticated(true)
                .roles(roleResponses)
                .build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("ecommerce.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> stringJoiner.add(role.getName()));

        return stringJoiner.toString();
    }
}
