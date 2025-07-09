import VoucherCarousel from '@/components/home/VoucherCarousel';

const page = () => {
  // const headersList = await headers();
  // const pathName = headersList.get('x-pathname');
  // console.log(pathName);
  return (
    <div className="min-h-screen bg-home">
      <VoucherCarousel />
    </div>
  );
};

export default page;
