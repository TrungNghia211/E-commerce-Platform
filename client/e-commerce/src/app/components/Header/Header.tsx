"use client";

import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { Avatar, Dropdown, MenuProps, Input } from "antd";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

import styles from "./Header.module.scss";
import { useCart } from "@/app/store/CartContext";
import { clientSessionToken } from "@/lib/http";
import userApiRequest from "@/apiRequests/user";
import productApiRequest from "@/apiRequests/product";
import { HomepageProductResponse } from "@/types/product";

interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

const cx = classNames.bind(styles);

function Header() {
  const { cartCount } = useCart();
  const displayCartCount = clientSessionToken.value ? cartCount : 0;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<HomepageProductResponse[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await productApiRequest.searchProducts(keyword);
        setSearchResults(response.payload.result.content);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    handleSearch(value);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(
        `/search?keyword=${encodeURIComponent(searchKeyword.trim())}`
      );
      setSearchResults([]);
    }
  };

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

          <form onSubmit={handleSearchSubmit} className={cx("inputWrapper")}>
            <div className={cx("searchInputContainer")}>
              <Input
                className={cx("searchInput")}
                placeholder="Bạn tìm gì hôm nay..."
                value={searchKeyword}
                onChange={handleSearchChange}
                spellCheck={false}
                suffix={
                  <CloseOutlined
                    className={cx("clearIcon", {
                      hidden: !searchKeyword,
                    })}
                    onClick={handleClearSearch}
                  />
                }
              />
              {searchResults.length > 0 && (
                <div className={cx("searchResults")}>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={cx("searchResultItem")}
                      onClick={() => setSearchResults([])}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className={cx("searchResultImage")}
                      />
                      <div className={cx("searchResultInfo")}>
                        <div className={cx("searchResultName")}>
                          {product.name}
                        </div>
                        <div className={cx("searchResultPrice")}>
                          {new Intl.NumberFormat("vi-VN").format(product.price)}
                          đ
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={cx("searchBtn")}>
              <SearchOutlined className={cx("searchIcon")} />
            </button>
          </form>

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
