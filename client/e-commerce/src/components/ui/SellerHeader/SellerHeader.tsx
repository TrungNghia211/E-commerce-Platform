"use client";

import classNames from "classnames/bind";

import styles from "./SellerHeader.module.scss";
import Link from "next/link";
import { Avatar, Dropdown, MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import userApiRequest from "@/apiRequests/user";
import { clientSessionToken } from "@/lib/http";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

export default function SellerHeader() {
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
      {/* <div className={cx("bottomDivWrapper")}> */}
      <Link className={cx("logo")} href="/">
        <div className={cx("logoText")}>🛍️ ShopHub</div>
      </Link>

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
        <div className={cx("userAvatar")}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            // src={userInfo?.avatar}
            className={cx("avatar")}
          />
          <span className={cx("username")}>
            {/* {userInfo?.username || "User"} */}
            ntn
          </span>
        </div>
      </Dropdown>
    </div>
  );
}
