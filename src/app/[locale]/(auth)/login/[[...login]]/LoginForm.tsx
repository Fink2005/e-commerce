const LoginForm = () => {
  return (
    <div className="bg-black/45 p-8 rounded-lg space-y-4 text-white">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">Log in to CheapDeals</h2>
        <p className="text-lg">Enter your details below</p>
      </div>
      <form action="" className="flex flex-col text-white space-y-4">
        <input type="text" name="" id="" placeholder="Email or Phone Number" className="border-b-1 border-[#FAFAFA] text-xl w-full p-2 focus:outline-0" />
        <input type="password" name="password" id="" placeholder="Password" className="border-b-1 border-[#FAFAFA] text-xl w-full p-2" />
        <span className="ml-auto underline">Forget Password?</span>

        <button type="submit" className="text-2xl py-2 bg-[#DB4444] rounded-md">Log In</button>
      </form>
      <div className="w-fit mx-auto">
        <span>
          Doesn't have account?
          <a href="" className="ml-4 underline text-[#FAFAFA]">Sign up</a>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
