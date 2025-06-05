import { Col, Row } from "antd";

import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import ProductThumbnail from "@/app/components/ProductThumbnail/ProductThumbnail";
import productApiRequest from "@/apiRequests/product";
import RecommendedProducts from "@/app/components/RecommendedProducts/RecommendedProducts";

export default async function ProductDetail({ id }: { id: number }) {
  const getProductDetail = await productApiRequest.getProductDetail(id);

  const product = getProductDetail.payload.result;

  return (
    <div className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]">
      <div className="bg-[#ffffff]">
        <Row>
          <Col span={10} className="p-[15px]">
            <ProductThumbnail product={product} />
          </Col>

          <Col span={14}>
            <ProductInfo product={product} />
          </Col>
        </Row>
      </div>

      <div className="bg-[#ffffff] mt-[10px] p-[15px]">
        <p className="text-[30px] font-semibold">Mô tả sản phẩm</p>
        <div
          className="mt-[10px] leading-relaxed text-gray-700"
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          {product.description}
        </div>
      </div>

      {/* <div className="bg-[#ffffff] mt-[10px] p-[15px]">
        <p className="text-[30px] font-semibold text-center">
          Sản phẩm liên quan
        </p>
      </div> */}
      <RecommendedProducts productId={id} />
    </div>
  );
}
