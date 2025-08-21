"use client";

import OrbApp from "@/components/orb/App";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout, fetchWithAuth } from "@/utils/auth";

interface User {
  id: number;
  email: string;
  name?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:3000/users");

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-5xl font-bold">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Log out</span>
      </button>
      <div className="min-h-screen relative">
        {/* Logout Button - Absolute positioned */}

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-5xl font-bold mt-24 px-[32px]">
          {user?.name ? (
            <div>
              <h1>{"Good morning, " + user.name + "!"}</h1>
            </div>
          ) : (
            <div>Good morning!</div>
          )}

          <OrbApp />

          <div className="flex space-x-4 mt-[40px]">
            <button className="bg-blue-500 text-[18px] text-white px-4 py-2 border border-transparent rounded-none hover:bg-blue-600 transition">
              Get Started
            </button>
            <button className="bg-transparent text-[18px] text-black px-4 py-2 border border-black rounded-none hover:bg-white hover:text-black transition">
              Archive
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
