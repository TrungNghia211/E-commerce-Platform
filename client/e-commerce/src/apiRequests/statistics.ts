import http from "@/lib/http";
import {
  AdminStatistics,
  OverviewData,
  StatisticsFilter,
  SellerStatistics,
} from "@/types/statistics/statistics";

export const statisticsApi = {
  getAdminStatistics: async (filter: StatisticsFilter) => {
    const response = await http.get<AdminStatistics>("/statistics/admin", {
      params: filter,
    });
    return response;
  },

  getAdminOverview: async () => {
    const response = await http.get<OverviewData>("/statistics/admin/overview");
    return response;
  },

  getSellerStatistics: async (filter: StatisticsFilter) => {
    const response = await http.get<SellerStatistics>("/statistics/seller", {
      params: {
        ...filter,
        startDate: filter.startDate
          ? new Date(filter.startDate).toISOString()
          : undefined,
        endDate: filter.endDate
          ? new Date(filter.endDate).toISOString()
          : undefined,
      },
    });
    return response;
  },

  getSellerOverview: async () => {
    const response = await http.get<OverviewData>(
      "/statistics/seller/overview"
    );
    return response;
  },
};

// Utility functions for formatting
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat("vi-VN").format(num);

export const formatPercentage = (percentage: number): string =>
  `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
