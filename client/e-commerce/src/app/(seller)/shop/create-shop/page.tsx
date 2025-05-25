import CreateShopPage from "@/app/pages/CreateShop/CreateShop";
import { AddressProvider } from "@/app/store/AddressContext";

export default function CreateShop() {
  return (
    <AddressProvider>
      <CreateShopPage />
    </AddressProvider>
  );
}
