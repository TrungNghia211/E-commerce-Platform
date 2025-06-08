"use client";

import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { Avatar, Dropdown, MenuProps } from "antd";
import { useState, useEffect } from "react";

import styles from "./Header.module.scss";
import { useCart } from "@/app/store/CartContext";
import { clientSessionToken } from "@/lib/http";
import userApiRequest from "@/apiRequests/user";

const cx = classNames.bind(styles);

function Header() {
  const { cartCount } = useCart();
  const displayCartCount = clientSessionToken.value ? cartCount : 0;
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (clientSessionToken.value) {
        try {
          const response = await userApiRequest.getMe();
          setUserInfo(response.payload.result);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };
    fetchUserInfo();
  }, [clientSessionToken.value]);

  const handleCartClick = () => {
    if (clientSessionToken.value) router.push("/cart");
    else router.push("/login");
  };

  // const handleLogout = () => {
  //   clientSessionToken.value = "";
  //   window.dispatchEvent(new Event("login")); // Trigger login event to update UI
  //   router.push("/login");
  // };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "account",
      icon: <UserSwitchOutlined />,
      label: "Tài khoản của tôi",
      onClick: () => router.push("/profile"),
    },
    // {
    //   key: "orders",
    //   icon: <ShoppingOutlined />,
    //   label: "Đơn mua",
    //   onClick: () => router.push("/orders"),
    // },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      // onClick: handleLogout,
    },
  ];

  return (
    <>
      <header className={cx("header")}>
        <nav className={cx("topDivWrapper")}>
          <div className={cx("sellerChannel")}>
            <Link href="/shop">Kênh người bán</Link>
          </div>

          <ul className={cx("ulWrapper")}>
            <li className={cx("navItem")}>
              <a className={cx("notificationLink")} href="">
                <BellOutlined className={cx("notificationIcon")} />
                <span>Thông báo</span>
              </a>
            </li>

            {clientSessionToken.value ? (
              <li className={cx("navItem")}>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <div className={cx("userAvatar")}>
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      src={userInfo?.avatar}
                      className={cx("avatar")}
                    />
                    <span className={cx("username")}>
                      {userInfo?.username || "User"}
                    </span>
                  </div>
                </Dropdown>
              </li>
            ) : (
              <>
                <li className={cx("navItem")}>
                  <Link href="/register" className={cx("navLink")}>
                    Đăng ký
                  </Link>
                </li>

                <li className={cx("navItem")}>
                  <Link href="/login" className={cx("navLink")}>
                    Đăng nhập
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className={cx("bottomDivWrapper")}>
          <Link className={cx("logo")} href="/">
            <div className={cx("logoText")}>🛍️ ShopHub</div>
          </Link>

          <div className={cx("inputWrapper")}>
            <div className={cx("searchInputContainer")}>
              <input
                className={cx("searchInput")}
                placeholder="Bạn tìm gì hôm nay..."
                spellCheck={false}
              />
            </div>

            <button className={cx("searchBtn")}>
              <SearchOutlined className={cx("searchIcon")} />
            </button>
          </div>

          <button className={cx("cartBtn")} onClick={handleCartClick}>
            <ShoppingCartOutlined className={cx("cartIcon")} />
            {displayCartCount > 0 && (
              <span className={cx("cartBadge")}>{cartCount}</span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
