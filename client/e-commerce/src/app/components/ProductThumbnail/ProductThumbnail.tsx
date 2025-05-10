import { Image } from "antd";

import styles from "./ProductThumbnail.module.scss";
import classNames from "classnames/bind";
import ImageSlide from "@/components/ui/ImageSlide/ImageSlide";

const cx = classNames.bind(styles);

function ProductThumbnail() {
  return (
    <div className="w-full">
      <Image
        src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0svi2m2tjtb5b@resize_w900_nl.webp"
        alt=""
      />
      <ImageSlide />
    </div>
  );
}

export default ProductThumbnail;
