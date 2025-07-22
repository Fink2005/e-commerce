import Footer from '@/components/header-footer/Footer';
import Header from '@/components/header-footer/Header';
import RootTemplate from '@/templates/RootTemplate';

export default async function MainLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <RootTemplate>
      <Header />
      <div>
        {props.children}
      </div>
      <Footer />
    </RootTemplate>
  );
}
