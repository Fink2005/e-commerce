import { productRequests } from '@/app/apis/requests/product';
import CategoryBrowser from '@/components/home/CategoryBrowser';
import FeatureBrowser from '@/components/home/FeatureBrowser';
import ProductList from '@/components/home/ProductList';
import VoucherCarousel from '@/components/home/VoucherCarousel';
// Import products from the shared file

const Page = async () => {
  const products = await productRequests.getProducts();

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
