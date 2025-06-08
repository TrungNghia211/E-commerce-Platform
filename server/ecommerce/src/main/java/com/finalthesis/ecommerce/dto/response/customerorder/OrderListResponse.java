package com.finalthesis.ecommerce.dto.response.customerorder;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

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
