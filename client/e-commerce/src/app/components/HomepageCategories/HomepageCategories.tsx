import { Button } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

import CategoryCard from "@/app/components/CategoryCard/CategoryCard";

export default async function Category({
  productCategories,
}: {
  productCategories: any;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-[10px]">
        <p className="text-[30px] font-semibold">Danh mục</p>
        <Button className="w-[200px]" icon={<UnorderedListOutlined />}>
          Xem tất cả
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-[10px]">
        {productCategories.map((productCategory: any) => (
          <CategoryCard
            key={productCategory.id}
            name={productCategory.name}
            thumbnailURL={productCategory.thumbnail}
          />
        ))}
      </div>
    </>
  );
}
