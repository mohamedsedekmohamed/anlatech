import Navbar from "@/components/layout/Navbar";
import ProductDetails from "@/components/products/ProductDetails";
import Footer from "@/components/layout/Footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-card flex flex-col">
      <Navbar />
      <ProductDetails productId={id} />
      <Footer />
    </main>
  );
}
