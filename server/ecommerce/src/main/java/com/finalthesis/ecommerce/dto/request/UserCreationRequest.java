package com.finalthesis.ecommerce.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @Size(min = 3, max = 20, message = "INVALID_USERNAME")
    String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String password;

    @Size(min = 3, max = 40, message = "INVALID_FULL_NAME")
    String fullName;

    @Email(message = "INVALID_EMAIL")
    String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "INVALID_PHONE")
    String phone;
}
