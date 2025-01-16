"use client";

import { useRouter } from "next/navigation";
import { socket } from "@/utils/socket/socket";
import { useEffect } from "react";

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("userName");
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData);

    sessionStorage.setItem("userName", data.name as string);

    router.push("/chat");

    socket.connect();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        ></label>
        <input
          type="text"
          id="name"
          name="name"
          className="border border-gray-300 rounded-md p-2 w-full text-center"
          placeholder="Enter your name..."
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </div>
    </form>
  );
};
