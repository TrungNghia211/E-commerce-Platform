"use client";

import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";

import styles from "./AdminHeader.module.scss";
import userApiRequest from "@/apiRequests/user";
import { clientSessionToken } from "@/lib/http";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await userApiRequest.logout();

    clientSessionToken.value = "";

    router.push("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <div className={cx("container")}>
      <div className={cx("logo")}>Admin Dashboard</div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
        <Space className={cx("user-info")}>
          <span className={cx("welcome-text")}>Chào mừng, Admin</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
}
