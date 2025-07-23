import { productRequests } from '@/app/apis/requests/product';
import CategoryBrowser from '@/components/home/CategoryBrowser';
import FeatureBrowser from '@/components/home/FeatureBrowser';
import ProductList from '@/components/home/ProductList';
import VoucherCarousel from '@/components/home/VoucherCarousel';
import type { ProductType } from '@/types/product';
// Import products from the shared file

const Page = async ({ searchParams }: { searchParams: { productType?: string } }) => {
  const query = (await searchParams).productType?.toUpperCase() as ProductType;
  const products = await productRequests.getProductsByType(query);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col space-y-2 p-4">
      <VoucherCarousel />
      <CategoryBrowser />
      <FeatureBrowser />
      <ProductList products={products} />
    </div>
  );
};

export default Page;
