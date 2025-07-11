import CategoryBrowser from '@/components/home/CategoryBrowser';
import VoucherCarousel from '@/components/home/VoucherCarousel';

const page = () => {
  return (
    <div className="min-h-screen w-full max-w-md mx-auto p-4 flex flex-col space-y-2">
      <VoucherCarousel />
      <CategoryBrowser />
    </div>
  );
};

export default page;
