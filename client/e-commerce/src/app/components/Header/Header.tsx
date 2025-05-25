"use client";

import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import classNames from "classnames/bind";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

interface JWTPayload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  scope: string;
}

function Header() {
  const router = useRouter();

  // const handleSellerClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const token = Cookies.get('token');

  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }

  //   try {
  //     const decoded = jwtDecode<JWTPayload>(token);
      
  //     // Kiểm tra token hết hạn
  //     if (decoded.exp * 1000 < Date.now()) {
  //       router.push('/login');
  //       return;
  //     }

  //     // Kiểm tra role và chuyển hướng
  //     if (decoded.scope === 'SELLER') {
  //       router.push('/seller');
  //     } else {
  //       router.push('/create-shop');
  //     }
  //   } catch (error) {
  //     // Nếu token không hợp lệ, chuyển đến trang login
  //     router.push('/login');
  //   }
  // };

  return (
    <>
      <header className={cx("header")}>
        <nav className={cx("topDivWrapper")}>
          <div className="pt-[4px] pb-[4px] hover:text-[#cbd4dd] hover:cursor-pointer">
            <Link href="/shop">Kênh người bán</Link>
          </div>

          <ul className={cx("ulWrapper")}>
            <li className="mr-[10px] hover:text-[#cbd4dd] hover:cursor-pointer">
              <a className="mr-[2px]" href="">
                <BellOutlined />
              </a>
              <a href="">Thông báo</a>
            </li>
            <li className="mr-[10px] hover:text-[#cbd4dd] hover:cursor-pointer">
              <Link href="/register">Đăng ký</Link>
            </li>
            <li className="hover:text-[#cbd4dd] hover:cursor-pointer">
              <Link href="/login">Đăng nhập</Link>
            </li>
          </ul>
        </nav>

        <div className={cx("bottomDivWrapper")}>
          <Link className="text-amber-50" href="/">
            Logo
          </Link>

          <div className={cx("inputWrapper")}>
            <div className="pl-[10px] pr-[10px]">
              <input
                className="w-[754px] h-[34px]"
                style={{ outline: "none" }}
                placeholder="Bạn tìm gì..."
                spellCheck={false}
              />
            </div>

            <button className={cx("search-btn")}>
              <SearchOutlined />
            </button>
          </div>

          <button className="hover:cursor-pointer">
            <ShoppingCartOutlined className="text-[23px]" />
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
