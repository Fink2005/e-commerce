export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen bg-no-repeat bg-cover bg-login bg-gradient-to-br from-black via-gray-700 to-black via-50%">
      <div className="flex flex-col min-h-screen justify-center items-center relative px-8">
        {/* Brand Header */}
        <div className="text-center text-white space-y-2 mb-6">
          <h1 className="text-3xl font-bold font-inter">CheapDeals</h1>
          <p className="text-base font-poppins">Your shopping choice</p>
        </div>

        {/* Page Content */}
        <div className="w-full max-w-md">
          {props.children}
        </div>
      </div>
    </main>
  );
}
