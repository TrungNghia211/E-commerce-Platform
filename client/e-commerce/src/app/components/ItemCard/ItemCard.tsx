import { Card } from "antd";

function ItemCard({ props }: { props: any }) {
  return (
    <>
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
        <p className="truncate">{props.name}</p>
        <div className="flex justify-between mt-[10px]">
          <span>{props.price}</span>
          <span>Đã bán: {props.purchaseCount}</span>
        </div>
      </Card>
    </>
  );
}

export default ItemCard;
