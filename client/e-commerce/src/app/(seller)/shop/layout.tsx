import SellerMenu from "@/components/ui/SellerMenu/SellerMenu";
import SellerHeader from "@/components/ui/SellerHeader/SellerHeader";

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen grid grid-rows-[56px_1fr]">
      <SellerHeader />
      <div className="grid grid-cols-[256px_auto] h-full">
        <SellerMenu />
        <div
          className="p-4 w-full"
          style={{
            backgroundColor: "#f6f6f6",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
