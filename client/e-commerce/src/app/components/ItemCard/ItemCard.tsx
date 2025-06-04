import { Card } from "antd";
import Link from "next/link";

function ItemCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card
        hoverable
        cover={
          <div style={{ width: "100%", height: "250px", overflow: "hidden" }}>
            <img
              src={product.thumbnail}
              alt="example"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        }
      >
        <p className="truncate">{product.name}</p>
        <div className="flex justify-between mt-[10px]">
          <span>{product.price}đ</span>
          <span>
            Đã bán: {product.buyTurn === null ? "0" : product.buyTurn}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default ItemCard;
