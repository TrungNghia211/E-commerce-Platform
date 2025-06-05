import Link from "next/link";

interface Product {
  id: string | number;
  name: string;
  price: number;
  thumbnail?: string;
  buyTurn?: number | null;
}

function ItemCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 h-full">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-300 text-5xl">📦</div>
            </div>
          )}

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 line-clamp-2 text-sm leading-relaxed group-hover:text-blue-600 transition-colors duration-200 h-10">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-lg font-bold text-red-500">
            {formatPrice(product.price)}đ
          </div>

          {/* Sales Count */}
          <div className="text-xs text-gray-500">
            Đã bán {product.buyTurn === null ? 0 : product.buyTurn}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
