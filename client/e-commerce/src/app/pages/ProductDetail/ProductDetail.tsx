import { Col, Row } from "antd";

import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import ProductThumbnail from "@/app/components/ProductThumbnail/ProductThumbnail";

function ProductDetail() {
  return (
    <div className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]">
      <div className="bg-[#ffffff]">
        <Row>
          <Col span={10} className="p-[15px]">
            <ProductThumbnail />
          </Col>
          <Col span={14}>
            <ProductInfo />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProductDetail;
