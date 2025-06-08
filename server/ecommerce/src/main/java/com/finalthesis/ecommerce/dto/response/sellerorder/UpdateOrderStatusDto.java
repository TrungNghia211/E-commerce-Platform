package com.finalthesis.ecommerce.dto.response.sellerorder;

import com.finalthesis.ecommerce.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOrderStatusDto {
    @NotNull(message = "Trạng thái không được để trống")
    OrderStatus status;
}
