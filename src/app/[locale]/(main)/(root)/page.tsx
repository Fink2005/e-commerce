import { Header } from '@/components/header-footer/Header';

const page = () => {
  // const headersList = await headers();
  // const pathName = headersList.get('x-pathname');
  // console.log(pathName);
  return (
    <div className="min-h-screen bg-home">
      <Header />
      <p className='text-white text-center'>
      xin chao

      </p>
    </div>
  );
};

export default page;
