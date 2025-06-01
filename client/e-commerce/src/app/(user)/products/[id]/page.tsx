import ProductDetail from "@/app/pages/ProductDetail/ProductDetail";

async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return <ProductDetail id={id} />;
}

export default ProductDetailPage;
