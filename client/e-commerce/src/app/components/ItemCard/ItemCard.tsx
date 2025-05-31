import { Card } from "antd";
import Link from "next/link";

function ItemCard({ product }: { product: any }) {
  console.log("product: ", product);

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        hoverable
        cover={
          <img src={product.thumbnail} alt="example" width={400} height={400} />
        }
      >
        <p className="truncate">{product.name}</p>
        <div className="flex justify-between mt-[10px]">
          <span>{product.price}đ</span>
          <span>
            Đã bán:{" "}
            {product.purchaseCount === null ? "0" : product.purchaseCount}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default ItemCard;
