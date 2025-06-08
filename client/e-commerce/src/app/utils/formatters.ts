import { OrderStatus } from "@/types/customer-order/types";

export const formatCurrency = (amount: number): string =>
  `₫${amount.toLocaleString("vi-VN")}`;

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("vi-VN");

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return "orange";

    case OrderStatus.CONFIRMED:
      return "yellow";

    case OrderStatus.PROCESSING:
      return "blue";

    case OrderStatus.SHIPPING:
      return "black";

    case OrderStatus.DELIVERED:
      return "green";

    case OrderStatus.CANCELLED:
      return "red";

    default:
      return "default";
  }
};

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Chờ xác nhận";

    case OrderStatus.CONFIRMED:
      return "Đã xác nhận";

    case OrderStatus.PROCESSING:
      return "Đang xử lý";

    case OrderStatus.SHIPPING:
      return "Đang giao hàng";

    case OrderStatus.DELIVERED:
      return "Đã giao hàng";

    case OrderStatus.CANCELLED:
      return "Đã hủy";

    default:
      return status;
  }
};

export const getPaymentMethodText = (method: string): string => {
  switch (method) {
    case "VNPAY":
      return "VNPAY";

    case "COD":
      return "Thanh toán khi nhận hàng";

    default:
      return method;
  }
};
