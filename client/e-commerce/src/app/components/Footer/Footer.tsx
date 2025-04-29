import Link from "next/link";
import Image from "next/image";

import styles from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <>
      {/* <section className="flex justify-between px-[160px] pt-[10px] pb-[50px] border-t-4 border-[#228be6]">
        <div className="w-[200px]">
          <h2 className="text-3xl font-bold mb-4">
            ngtnguyen<span className="text-[#228be6]">.</span>
          </h2>

          <div className="flex items-start space-x-2 mb-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM15 11.25v.008h.008V11.25H15zm-6 0v.008h.008V11.25H9z"
              />
            </svg>
            <p>
              Tổng đài hỗ trợ
              <br />
              <span className="font-semibold">(079) 5694 103</span>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Địa chỉ liên hệ</h3>
            <p>97 Nguyễn Thị Thập, Hoà Minh, Liên Chiểu, Đà Nẵng</p>
          </div>
        </div>

        <div className="w-[200px]">
          <h3 className="font-semibold mb-4">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2 text-[#228be6]">
            <li>
              <Link href="#">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link href="#">Hướng dẫn đặt hàng</Link>
            </li>
            <li>
              <Link href="#">Phương thức vận chuyển</Link>
            </li>
            <li>
              <Link href="#">Chính sách đổi trả</Link>
            </li>
            <li>
              <Link href="#">Chính sách thanh toán</Link>
            </li>
            <li>
              <Link href="#">Giải quyết khiếu nại</Link>
            </li>
            <li>
              <Link href="#">Chính sách bảo mật</Link>
            </li>
          </ul>
        </div>

        <div className="flex-col w-[200px] text-right">
          <h3 className="font-semibold mb-4">Giới thiệu</h3>

          <ul className="space-y-2 text-[#228be6]">
            <li>
              <Link href="#">Về Công ty</Link>
            </li>
            <li>
              <Link href="#">Tuyển dụng</Link>
            </li>
            <li>
              <Link href="#">Hợp tác</Link>
            </li>
            <li>
              <Link href="#">Liên hệ mua hàng</Link>
            </li>
          </ul>
        </div>
      </section> */}

      <section className={cx("container")}>
        <div>
          <h2 className="font-bold mb-4">ngtnguyen</h2>
          <div className="flex items-start space-x-2 mb-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM15 11.25v.008h.008V11.25H15zm-6 0v.008h.008V11.25H9z"
              />
            </svg>
            <p>
              Tổng đài hỗ trợ
              <br />
              <span className="font-semibold">(079) 5694 103</span>
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Địa chỉ liên hệ</h2>
            <p>97 Nguyễn Thị Thập, Hoà Minh, Liên Chiểu, Đà Nẵng</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Hỗ trợ khách hàng</h2>
          <ul className="space-y-2 text-[#228be6]">
            <li className="hover:underline">
              <Link href="#">Câu hỏi thường gặp</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Hướng dẫn đặt hàng</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Phương thức vận chuyển</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Chính sách đổi trả</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Chính sách thanh toán</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Giải quyết khiếu nại</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Chính sách bảo mật</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Giới thiệu</h3>

          <ul className="space-y-2 text-[#228be6]">
            <li className="hover:underline">
              <Link href="#">Về Công ty</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Tuyển dụng</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Hợp tác</Link>
            </li>
            <li className="hover:underline">
              <Link href="#">Liên hệ mua hàng</Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Footer;
