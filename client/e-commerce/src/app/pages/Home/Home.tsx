import { Carousel } from "antd";

import productApiRequest from "@/apiRequests/product";
import productCategoryApiRequest from "@/apiRequests/productCategory";

import Category from "@/app/components/HomepageCategories/HomepageCategories";
import HomepageProducts from "@/app/components/HomepageProducts/HomepageProducts";

export default async function Home() {
  const productCategoriesRes =
    await productCategoryApiRequest.get8ProductCategories();
  const productCategories = productCategoriesRes.payload.result;

  const homepageProductsRes = await productApiRequest.getHomepageProducts(1);
  const homepageProducts = homepageProductsRes.payload.result.content;
  const totalPages = homepageProductsRes.payload.result.totalPages;

  return (
    <main className="mt-[110px] px-[160px] pb-[17px] pt-[17px] bg-[#f5f5f5]">
      {/* Carousel */}
      <div className="bg-[#ffffff]">
        <Carousel arrows autoplay infinite={false}>
          <div>
            <img
              src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m8lmt1qsafzi91_xxhdpi"
              className="bg-[#0066cc] text-[#fff] h-[300px] leading-[160px] text-center w-full"
            />
          </div>
        </Carousel>
      </div>

      {/* Show default 8 Categories */}
      <div className="mt-[10px]">
        <Category productCategories={productCategories} />
      </div>

      {/* Homepage Products */}
      <div className="mt-[10px]">
        <HomepageProducts
          homepageProducts={homepageProducts}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
