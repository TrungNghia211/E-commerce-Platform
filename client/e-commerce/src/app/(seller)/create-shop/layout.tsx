import SellerHeader from "@/components/ui/SellerHeader/SellerHeader";

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "#0066cc",
          color: "white",
          lineHeight: "48px",
          textAlign: "center",
          fontSize: "20px",
          marginBottom: "10px",
        }}
      >
        Tạo Shop
      </div>
      {children}
    </>
  );
}
