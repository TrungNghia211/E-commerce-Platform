package com.finalthesis.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {

    String name;

    String description;

    //    Set<PermissionResponse> permissions;

}
