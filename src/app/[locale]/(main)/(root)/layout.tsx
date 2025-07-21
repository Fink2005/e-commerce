
export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen">
      {props.children}
      {/* <Footer /> */}
    </main>
  );
}
