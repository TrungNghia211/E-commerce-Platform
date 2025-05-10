package com.finalthesis.ecommerce.service;

import com.finalthesis.ecommerce.dto.request.AuthenticationRequest;
import com.finalthesis.ecommerce.dto.response.AuthenticationResponse;

public interface AuthenticationService {

    AuthenticationResponse isAuthenticated(AuthenticationRequest authenticationRequest);

    //    IntrospectResponse introspectToken(IntrospectRequest introspectRequest);

}
