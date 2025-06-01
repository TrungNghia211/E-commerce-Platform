import { Image } from "antd";

import ImageSlide from "@/components/ui/ImageSlide/ImageSlide";

function ProductThumbnail({ product }: { product: any }) {
  return (
    <div className="w-full">
      <Image
        src={product.thumbnail}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          margin: "0 auto",
        }}
      />
      <ImageSlide productItems={product.productItems} />
    </div>
  );
}

export default ProductThumbnail;
