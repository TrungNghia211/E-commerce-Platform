"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result, Button, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

function VNPayReturnPage() {
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_Amount = searchParams.get("vnp_Amount");

    // Xử lý kết quả thanh toán
    if (vnp_ResponseCode === "00") {
      setPaymentStatus("success");

      // Có thể call API để verify payment với backend
      // verifyPayment({
      //   responseCode: vnp_ResponseCode,
      //   txnRef: vnp_TxnRef,
      //   amount: vnp_Amount
      // });

      // Redirect sau 3 giây
      setTimeout(() => {
        router.push("/profile?tab=orders&payment=success");
      }, 3000);
    } else {
      setPaymentStatus("failed");

      // Redirect sau 3 giây
      setTimeout(() => {
        router.push("/profile?tab=orders&payment=failed");
      }, 3000);
    }
  }, [searchParams, router]);

  if (paymentStatus === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spin size="large" />
        <span style={{ marginLeft: "16px" }}>
          Đang xử lý kết quả thanh toán...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "50px", textAlign: "center" }}
      className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]"
    >
      {paymentStatus === "success" ? (
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          status="success"
          title="Thanh toán thành công!"
          subTitle="Đơn hàng của bạn đã được xử lý thành công. Bạn sẽ được chuyển đến trang đơn hàng trong giây lát."
          extra={[
            <Button
              type="primary"
              key="orders"
              onClick={() => router.push("/profile?tab=orders")}
            >
              Xem đơn hàng
            </Button>,
            <Button key="home" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>,
          ]}
        />
      ) : (
        <Result
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          status="error"
          title="Thanh toán thất bại!"
          subTitle="Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
          extra={[
            <Button type="primary" key="retry" onClick={() => router.back()}>
              Thử lại
            </Button>,
            <Button key="home" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>,
          ]}
        />
      )}
    </div>
  );
}

export default VNPayReturnPage;
