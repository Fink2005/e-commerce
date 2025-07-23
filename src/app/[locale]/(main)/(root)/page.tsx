import { productRequests } from '@/app/apis/requests/product';
import CategoryBrowser from '@/components/home/CategoryBrowser';
import FeatureBrowser from '@/components/home/FeatureBrowser';
import ProductList from '@/components/home/ProductList';
import VoucherCarousel from '@/components/home/VoucherCarousel';
import type { ProductType } from '@/types/product';

interface PageProps {
  searchParams: Promise<{ productType?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.productType?.toUpperCase() as ProductType;
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
