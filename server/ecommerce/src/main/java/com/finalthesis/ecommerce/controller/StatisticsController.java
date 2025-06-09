package com.finalthesis.ecommerce.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.finalthesis.ecommerce.dto.request.statistics.AdminStatisticsDTO;
import com.finalthesis.ecommerce.dto.request.statistics.SellerStatisticsDTO;
import com.finalthesis.ecommerce.dto.request.statistics.StatisticsFilterDTO;
import com.finalthesis.ecommerce.entity.User;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.StatisticsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticsController {
    StatisticsService statisticsService;

    UserRepository userRepository;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatisticsDTO> getAdminStatistics(
            //            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            // LocalDateTime startDate,
            //            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            // LocalDateTime endDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate endDate,
            @RequestParam(required = false, defaultValue = "MONTHLY") String period,
            @RequestParam(required = false) List<String> orderStatus,
            @RequestParam(required = false) List<String> paymentStatus) {

        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        // Default to last 12 months if no dates provided
        if (startDate == null) {
            //            startDate = LocalDateTime.now()
            //                    .minusMonths(12)
            //                    .withDayOfMonth(1)
            //                    .withHour(0)
            //                    .withMinute(0)
            //                    .withSecond(0);
            startDateTime = LocalDateTime.now()
                    .minusMonths(12)
                    .withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0);
        } else startDateTime = startDate.atStartOfDay();

        if (endDate == null)
            //            endDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
            endDateTime = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        else endDateTime = endDate.atTime(23, 59, 59);

        StatisticsFilterDTO filter = StatisticsFilterDTO.builder()
                //                .startDate(startDate)
                .startDate(startDateTime)
                //                .endDate(endDate)
                .endDate(endDateTime)
                .period(period)
                .orderStatus(orderStatus)
                .paymentStatus(paymentStatus)
                .build();

        AdminStatisticsDTO statistics = statisticsService.getAdminStatistics(filter);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerStatisticsDTO> getSellerStatistics(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "MONTHLY") String period,
            @RequestParam(required = false) List<String> orderStatus,
            @RequestParam(required = false) List<String> paymentStatus) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Default to last 12 months if no dates provided
        if (startDate == null) {
            startDate = LocalDateTime.now()
                    .minusMonths(12)
                    .withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0);
        }
        if (endDate == null)
            endDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        StatisticsFilterDTO filter = StatisticsFilterDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .period(period)
                .orderStatus(orderStatus)
                .paymentStatus(paymentStatus)
                .build();

        SellerStatisticsDTO statistics = statisticsService.getSellerStatistics(user.getId(), filter);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/admin/seller/{sellerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SellerStatisticsDTO> getSellerStatisticsForAdmin(
            @PathVariable Integer sellerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "MONTHLY") String period) {

        // Default to last 12 months if no dates provided
        if (startDate == null) {
            startDate = LocalDateTime.now()
                    .minusMonths(12)
                    .withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0);
        }
        if (endDate == null)
            endDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        StatisticsFilterDTO filter = StatisticsFilterDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .period(period)
                .build();

        SellerStatisticsDTO statistics = statisticsService.getSellerStatistics(sellerId, filter);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/admin/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminOverview() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth =
                now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);

        StatisticsFilterDTO currentMonth = StatisticsFilterDTO.builder()
                .startDate(startOfMonth)
                .endDate(now)
                .build();

        StatisticsFilterDTO lastMonth = StatisticsFilterDTO.builder()
                .startDate(startOfLastMonth)
                .endDate(startOfMonth.minusSeconds(1))
                .build();

        AdminStatisticsDTO currentStats = statisticsService.getAdminStatistics(currentMonth);
        AdminStatisticsDTO lastStats = statisticsService.getAdminStatistics(lastMonth);

        Map<String, Object> overview = new HashMap<>();
        overview.put("currentMonth", currentStats);
        overview.put("lastMonth", lastStats);
        overview.put("growth", calculateGrowthPercentages(currentStats, lastStats));

        return ResponseEntity.ok(overview);
    }

    @GetMapping("/seller/overview")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> getSellerOverview() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth =
                now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);

        StatisticsFilterDTO currentMonth = StatisticsFilterDTO.builder()
                .startDate(startOfMonth)
                .endDate(now)
                .build();

        StatisticsFilterDTO lastMonth = StatisticsFilterDTO.builder()
                .startDate(startOfLastMonth)
                .endDate(startOfMonth.minusSeconds(1))
                .build();

        SellerStatisticsDTO currentStats = statisticsService.getSellerStatistics(user.getId(), currentMonth);
        SellerStatisticsDTO lastStats = statisticsService.getSellerStatistics(user.getId(), lastMonth);

        Map<String, Object> overview = new HashMap<>();
        overview.put("currentMonth", currentStats);
        overview.put("lastMonth", lastStats);
        overview.put("growth", calculateSellerGrowthPercentages(currentStats, lastStats));

        return ResponseEntity.ok(overview);
    }

    private Map<String, Double> calculateGrowthPercentages(AdminStatisticsDTO current, AdminStatisticsDTO last) {
        Map<String, Double> growth = new HashMap<>();

        growth.put("revenue", calculatePercentageGrowth(current.getTotalRevenue(), last.getTotalRevenue()));
        growth.put(
                "orders",
                calculatePercentageGrowth(
                        current.getTotalOrders().doubleValue(),
                        last.getTotalOrders().doubleValue()));
        growth.put(
                "users",
                calculatePercentageGrowth(
                        current.getTotalUsers().doubleValue(),
                        last.getTotalUsers().doubleValue()));
        growth.put(
                "sellers",
                calculatePercentageGrowth(
                        current.getTotalSellers().doubleValue(),
                        last.getTotalSellers().doubleValue()));

        return growth;
    }

    private Map<String, Double> calculateSellerGrowthPercentages(
            SellerStatisticsDTO current, SellerStatisticsDTO last) {
        Map<String, Double> growth = new HashMap<>();

        growth.put("revenue", calculatePercentageGrowth(current.getTotalRevenue(), last.getTotalRevenue()));
        growth.put(
                "orders",
                calculatePercentageGrowth(
                        current.getTotalOrders().doubleValue(),
                        last.getTotalOrders().doubleValue()));
        growth.put(
                "products",
                calculatePercentageGrowth(
                        current.getTotalProducts().doubleValue(),
                        last.getTotalProducts().doubleValue()));
        growth.put(
                "earnings", calculatePercentageGrowth(current.getTotalSellerEarnings(), last.getTotalSellerEarnings()));

        return growth;
    }

    private Double calculatePercentageGrowth(BigDecimal current, BigDecimal last) {
        if (last == null || last.compareTo(BigDecimal.ZERO) == 0)
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        if (current == null) current = BigDecimal.ZERO;
        return current.subtract(last)
                .divide(last, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .doubleValue();
    }

    private Double calculatePercentageGrowth(Double current, Double last) {
        if (last == null || last == 0) return current != null && current > 0 ? 100.0 : 0.0;
        if (current == null) current = 0.0;
        return ((current - last) / last) * 100;
    }
}
