import AdminHeader from "@/components/ui/AdminHeader/AdminHeader";
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/category");
}
