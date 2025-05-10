import { Card } from "antd";
import Link from "next/link";

function ItemCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card
        hoverable
        cover={
          <img
            src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxki9vx479ax84@resize_w900_nl.webp"
            // className="w-full"
            alt="example"
            width={400}
            height={400}
          />
        }
      >
        <p className="truncate">{product.name}</p>
        <div className="flex justify-between mt-[10px]">
          <span>{product.price}</span>
          <span>Đã bán: {product.purchaseCount}</span>
        </div>
      </Card>
    </Link>
  );
}

export default ItemCard;
