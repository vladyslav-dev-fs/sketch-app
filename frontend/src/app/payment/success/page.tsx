"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth";

interface User {
  id: number;
  email: string;
  name?: string;
  proPlan: boolean;
}

export default function PaymentSuccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:3000/users");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit for webhook to process
    setTimeout(fetchUser, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          {loading ? (
            <p className="text-gray-600 mb-6">Processing your upgrade...</p>
          ) : user?.proPlan ? (
            <div>
              <p className="text-gray-600 mb-4">
                🎉 Welcome to Pro Plan! You now have unlimited AI requests.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  ✓ Unlimited daily requests
                </p>
                <p className="text-green-800 font-medium">✓ Priority support</p>
                <p className="text-green-800 font-medium">
                  ✓ Early access to new features
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 mb-6">
              Your upgrade is being processed. It may take a few moments to
              activate.
            </p>
          )}

          <div className="space-y-4">
            <Link
              href="/chat"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Creating Content
            </Link>

            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
