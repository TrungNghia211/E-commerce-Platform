export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  platformFee: number;
  sellerEarnings: number;
  orderCount: number;
}

export interface TopSellerData {
  sellerId: number;
  sellerName: string;
  totalRevenue: number;
  totalOrders: number;
  platformFee: number;
}

export interface ProductStatsData {
  productId: number;
  productName: string;
  thumbnail: string;
  quantitySold: number;
  revenue: number;
  averageRating?: number;
}

export interface OrderStatusCountData {
  status: string;
  count: number;
  totalAmount: number;
}

export interface CategoryStatsData {
  categoryId: number;
  categoryName: string;
  productCount: number;
  totalSold: number;
  revenue: number;
}

export interface AdminStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalPlatformFee: number;
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  monthlyRevenue: MonthlyRevenueData[];
  topSellers: TopSellerData[];
  orderStatusStats: OrderStatusCountData[];
  categoryStats: CategoryStatsData[];
}

export interface SellerStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalSellerEarnings: number;
  totalPlatformFee: number;
  totalProducts: number;
  totalProductsSold: number;
  monthlyRevenue: MonthlyRevenueData[];
  topProducts: ProductStatsData[];
  orderStatusStats: OrderStatusCountData[];
}

export interface StatisticsFilter {
  startDate?: string;
  endDate?: string;
  period?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  orderStatus?: string[];
  paymentStatus?: string[];
}

export interface GrowthData {
  revenue: number;
  orders: number;
  users?: number;
  sellers?: number;
  products?: number;
  earnings?: number;
}

export interface OverviewData {
  currentMonth: AdminStatistics | SellerStatistics;
  lastMonth: AdminStatistics | SellerStatistics;
  growth: GrowthData;
}
