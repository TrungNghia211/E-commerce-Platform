"use client";

import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";

import styles from "./Header.module.scss";
import { useCart } from "@/app/store/CartContext";
import { clientSessionToken } from "@/lib/http";

const cx = classNames.bind(styles);

function Header() {
  const { cartCount } = useCart();
  const displayCartCount = clientSessionToken.value ? cartCount : 0;

  const router = useRouter();

  const handleCartClick = () => {
    if (clientSessionToken.value) router.push("/cart");
    else router.push("/login");
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
            {/* {cartCount > 0 && (
              <span className={cx("cartBadge")}>{cartCount}</span>
            )} */}
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
