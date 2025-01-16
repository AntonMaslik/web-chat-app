"use client";

import { RegisterForm } from "@/components/RegisterForm/RegisterForm";

const Home = () => {
  return (
    <div className="bg-black-100 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-white text-2xl font-bold mb-6">
          Register name for chat
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Home;
