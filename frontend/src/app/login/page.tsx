"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // <--

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:3000/auth/validate", {
          credentials: "include",
        });

        if (res.ok) {
          router.replace("/");
        } else {
          setIsCheckingAuth(false); // <--
        }
      } catch (error) {
        console.log(error);
        setIsCheckingAuth(false); // <--
      }
    }

    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      router.replace("/");
    } else {
      setError("Invalid credentials");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto pt-24 px-4 flex flex-col gap-4"
    >
      <h1 className="text-3xl font-semibold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
      >
        Log In
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
