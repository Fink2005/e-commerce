export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen bg-login bg-[radial-gradient(_#999180_0%,_#000000_100%)] bg-no-repeat bg-cover">{props.children}</main>
  );
}
