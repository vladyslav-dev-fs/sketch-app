"use client";

import OrbApp from "@/components/orb/App";
import { useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { logout, fetchWithAuth } from "@/utils/auth";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name?: string;
  requests: number;
  proPlan: boolean;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrbReady, setIsOrbReady] = useState(false);

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
        setTimeout(() => setIsOrbReady(true), 100);
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
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {/* Plan Status */}
        {user && (
          <div className="flex items-center gap-3">
            {user.proPlan ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <StarIcon className="w-4 h-4" />
                Pro Plan
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span
                    className={
                      user.requests > 2
                        ? "text-green-600"
                        : user.requests > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {user.requests}
                  </span>
                  <span className="text-gray-500">/5 requests left</span>
                </div>
                <Link
                  href="/upgrade"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  <StarIcon className="w-4 h-4" />
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>

      <div className="min-h-screen relative">
        <div className="flex flex-col items-center justify-center text-5xl font-bold mt-24 px-[32px]">
          {user?.name ? (
            <div>
              <h1>{"Good morning, " + user.name + "!"}</h1>
              {user.proPlan && (
                <div className="text-lg font-normal text-blue-600 mt-2">
                  ✨ Pro Plan Active - Unlimited Requests
                </div>
              )}
            </div>
          ) : (
            <div>Good morning!</div>
          )}

          {isOrbReady && <OrbApp key="orb" />}

          <div className="flex space-x-4 mt-[40px]">
            <Link
              href={"/chat"}
              className={`text-[18px] px-4 py-2 border rounded-none transition ${
                user && !user.proPlan && user.requests <= 0
                  ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white border-transparent hover:bg-blue-600"
              }`}
              onClick={(e) => {
                if (user && !user.proPlan && user.requests <= 0) {
                  e.preventDefault();
                }
              }}
            >
              {user && !user.proPlan && user.requests <= 0
                ? "No Requests Left"
                : "New Chat"}
            </Link>
            <button className="bg-transparent text-[18px] text-black px-4 py-2 border border-black rounded-none hover:bg-white hover:text-black transition">
              Archive
            </button>
          </div>

          {/* Request limit warning */}
          {user && !user.proPlan && user.requests <= 2 && (
            <div className="mt-6 max-w-md text-center">
              <div
                className={`p-4 rounded-lg ${
                  user.requests === 0
                    ? "bg-red-100 border border-red-200"
                    : "bg-yellow-100 border border-yellow-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    user.requests === 0 ? "text-red-700" : "text-yellow-700"
                  }`}
                >
                  {user.requests === 0
                    ? "You've used all your free requests for today. Upgrade to Pro for unlimited access!"
                    : `Only ${user.requests} request${
                        user.requests === 1 ? "" : "s"
                      } left today.`}
                </p>
                <Link
                  href="/upgrade"
                  className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
