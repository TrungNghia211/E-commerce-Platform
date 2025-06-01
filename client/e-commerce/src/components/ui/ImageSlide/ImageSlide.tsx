"use client";

import { Image } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import classNames from "classnames/bind";

import styles from "./ImageSlide.module.scss";

const cx = classNames.bind(styles);

function ImageSlide({ productItems }: { productItems: any }) {
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
        {/* <button onClick={scrollLeft} className={cx("button-left")}>
          <ArrowLeftOutlined />
        </button> */}

        <div ref={containerRef} className={cx("thumbnailContainer")}>
          {productItems.map((productItem: any) => (
            <button key={productItem.id} className={cx("thumbnailVariant")}>
              <Image src={productItem.thumbnail} />
            </button>
          ))}
        </div>

        {/* <button onClick={scrollRight} className={cx("button-right")}>
          <ArrowRightOutlined />
        </button> */}
      </div>
    </>
  );
}

export default ImageSlide;
