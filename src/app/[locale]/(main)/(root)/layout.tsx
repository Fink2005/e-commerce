import Header from '@/components/header-footer/Header';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen overflow-y-auto">
      <Header />
      {props.children}
      {/* <Footer /> */}
    </main>
  );
}
