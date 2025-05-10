import ProductDetail from "@/app/pages/ProductDetail/ProductDetail";

async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return <ProductDetail />;
}

export default ProductDetailPage;
