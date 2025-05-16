import classNames from "classnames/bind";

import AdminHeader from "@/components/ui/AdminHeader/AdminHeader";
import AdminMenu from "@/components/ui/AdminMenu/AdminMenu";

import styles from "./Layout.module.scss";

const cx = classNames.bind(styles);

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cx("container")}>
      <div>
        <AdminHeader />
      </div>
      <div className={cx("content")}>
        <AdminMenu />
        {children}
      </div>
    </div>
  );
}
