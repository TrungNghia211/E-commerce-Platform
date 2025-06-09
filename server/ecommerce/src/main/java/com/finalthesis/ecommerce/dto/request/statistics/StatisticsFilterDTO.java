package com.finalthesis.ecommerce.dto.request.statistics;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticsFilterDTO {
    LocalDateTime startDate;

    LocalDateTime endDate;

    String period; // DAILY, WEEKLY, MONTHLY, YEARLY

    List<String> orderStatus;

    List<String> paymentStatus;
}
