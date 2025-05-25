package com.finalthesis.ecommerce.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShopCreationRequest {
    Integer id;

    String name;

    String phone;

    String addressLine;

    Integer provinceId;
    String provinceName;

    Integer districtId;
    String districtName;

    Integer wardId;
    String wardName;

    String bankName;
    String bankAccountNumber;
    String bankAccountHolderName;

    MultipartFile citizenIdFrontImage;
    MultipartFile citizenIdBackImage;
}
