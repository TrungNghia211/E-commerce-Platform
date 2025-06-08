package com.finalthesis.ecommerce.dto.response.customerorder;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderListResponse {
    List<OrderDTO> orders;

    Long totalElements;

    Integer totalPages;

    Integer currentPage;

    Integer pageSize;

    Boolean hasNext;

    Boolean hasPrevious;
}
