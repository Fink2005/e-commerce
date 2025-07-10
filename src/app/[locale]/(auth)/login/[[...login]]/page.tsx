import LoginForm from './LoginForm';

const login = () => {
  return (
    <div className="flex flex-col items-center relative px-8 h-screen">
      <div className="space-y-4 w-full my-auto">
        <div className="flex flex-col items-center text-white">
          <h1 className="text-4xl font-bold">CheapDeals</h1>
          <p className="text-2xl">Your shopping choice</p>
        </div>
        <div className="bg-login-card">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default login;
