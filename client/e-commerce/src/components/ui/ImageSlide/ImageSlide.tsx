"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import classNames from "classnames/bind";

import styles from "./ImageSlide.module.scss";
import { Image } from "antd";

const cx = classNames.bind(styles);

function ImageSlide() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (containerRef.current)
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
  };

  return (
    <>
      <div className={cx("container")}>
        <button onClick={scrollLeft} className={cx("button-left")}>
          <ArrowLeftOutlined />
        </button>

        <div ref={containerRef} className={cx("thumbnailContainer")}>
          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt26zqnogknt8c.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsr9hfg39dqc02@resize_w900_nl.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsr9hfg36klg47.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln4h8y5v4grc14.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt26zqnojdsp35.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt26xbw9ryjd64.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgoior6ccjcj44@resize_w900_nl.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvy1h6ekuo63af_tn" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt26zqnojdsp35.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt26xbw9ryjd64.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgoior6ccjcj44@resize_w900_nl.webp" />
          </button>

          <button className={cx("thumbnailVariant")}>
            <Image src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvy1h6ekuo63af_tn" />
          </button>
        </div>

        <button onClick={scrollRight} className={cx("button-right")}>
          <ArrowRightOutlined />
        </button>
      </div>
    </>
  );
}

export default ImageSlide;

// =========================

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Image from "next/image";

// // Dữ liệu tạm thời cho các biến thể sản phẩm (tương ứng với ảnh Shopee)
// const productVariants = [
//   {
//     id: 1,
//     imageUrl:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//     thumbnail:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//   },
//   {
//     id: 2,
//     imageUrl:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//     thumbnail:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//   },
//   {
//     id: 3,
//     imageUrl:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7p6pihq4sqraf@resize_w900_nl.webp",
//     thumbnail:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7p6pihq4sqraf@resize_w900_nl.webp",
//   },
//   {
//     id: 4,
//     imageUrl:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//     thumbnail:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//   },
//   {
//     id: 5,
//     imageUrl:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//     thumbnail:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp",
//   },
// ];

// const ImageSlide = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const handleThumbnailClick = (index: number) => {
//     setCurrentImageIndex(index);
//     if (containerRef.current) {
//       containerRef.current.scrollLeft =
//         index * containerRef.current.offsetWidth;
//     }
//   };

//   const scrollLeft = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({
//         left: -containerRef.current.offsetWidth,
//         behavior: "smooth",
//       });
//       setCurrentImageIndex((prevIndex) => Math.max(0, prevIndex - 1));
//     }
//   };

//   const scrollRight = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({
//         left: containerRef.current.offsetWidth,
//         behavior: "smooth",
//       });
//       setCurrentImageIndex((prevIndex) =>
//         Math.min(productVariants.length - 1, prevIndex + 1)
//       );
//     }
//   };

//   return (
//     <div className="relative">
//       <button className="w-24 h-24">
//         <img
//           src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp"
//           alt=""
//         />
//       </button>
//       {/* Ảnh chính */}
//       <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-md">
//         <img
//           src={productVariants[currentImageIndex].imageUrl}
//           alt={`Ảnh sản phẩm ${currentImageIndex + 1}`}
//           className="transition-opacity duration-300"
//         />
//       </div>

//       {/* Carousel các thumbnails */}
//       <div className="relative mt-2">
//         {/* Nút mũi tên trái */}
//         {currentImageIndex > 0 && (
//           <button
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center -ml-2 cursor-pointer z-10"
//             onClick={scrollLeft}
//           >
//             left
//           </button>
//         )}

//         {/* Vùng chứa các thumbnails có thể cuộn */}
//         <div
//           ref={containerRef}
//           className="flex overflow-x-auto scroll-smooth scrollbar-hide" // scrollbar-hide để ẩn thanh cuộn mặc định
//         >
//           {productVariants.map((variant, index) => (
//             <button
//               key={variant.id}
//               className={`w-24 h-24 rounded-md overflow-hidden flex-shrink-0 cursor-pointer transition-opacity duration-200 ${
//                 currentImageIndex === index
//                   ? "opacity-100 border-2 border-red-500"
//                   : "opacity-60 hover:opacity-100"
//               }`}
//               onClick={() => handleThumbnailClick(index)}
//             >
//               <img src={variant.thumbnail} alt={`Biến thể ${variant.id}`} />
//             </button>
//           ))}
//         </div>

//         {/* Nút mũi tên phải */}
//         {currentImageIndex < productVariants.length - 1 && (
//           <button
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center -mr-2 cursor-pointer z-10"
//             onClick={scrollRight}
//           >
//             right
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageSlide;
