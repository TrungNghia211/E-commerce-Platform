import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import classNames from "classnames/bind";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

function Header() {
  return (
    <>
      <header className={cx("header")}>
        <nav className={cx("topDivWrapper")}>
          <div className="pt-[4px] pb-[4px] hover:text-[#cbd4dd] hover:cursor-pointer">
            <a href="">Kênh người bán</a>
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
