"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/auth";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name?: string;
  requests: number;
  proPlan: boolean;
}

export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:3000/users");

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // If user already has pro plan, redirect to home
          if (userData.proPlan) {
            router.push("/");
          }
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
  }, [router]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        "http://localhost:3000/payment/create-checkout-session",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create checkout session"
      );
      console.error("Upgrade error:", err);
    } finally {
      setUpgrading(false);
    }
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
      <div className="h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-2xl font-bold text-red-600 mb-4">
            Error: {error}
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Pro Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited AI-generated product descriptions with our one-time
            Pro Plan purchase
          </p>
        </div>

        {/* Current Status */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Plan Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Requests remaining today:</span>{" "}
                  <span
                    className={
                      user.requests > 2
                        ? "text-green-600"
                        : user.requests > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {user.requests} / 5
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Free plan limits reset daily at midnight (Kyiv time)
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Free Plan
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Feature Column */}
            <div className="bg-gray-50 p-6 border-r border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Features</h3>
              <div className="space-y-4">
                <div className="py-3">AI Product Descriptions</div>
                <div className="py-3">Daily Request Limit</div>
                <div className="py-3">Bookmark Favorite Items</div>
                <div className="py-3">Request History</div>
                <div className="py-3">Priority Support</div>
                <div className="py-3">Future Premium Features</div>
              </div>
            </div>

            {/* Free Plan Column */}
            <div className="p-6 border-r border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
              <p className="text-sm text-gray-600 mb-6">Current Plan</p>
              <div className="space-y-4">
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Basic Access</span>
                </div>
                <div className="py-3 flex items-center">
                  <XMarkIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm">5 per day</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Included</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Included</span>
                </div>
                <div className="py-3 flex items-center">
                  <XMarkIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm">Not included</span>
                </div>
                <div className="py-3 flex items-center">
                  <XMarkIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm">Not included</span>
                </div>
              </div>
            </div>

            {/* Pro Plan Column */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                BEST VALUE
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">
                Pro Plan
              </h3>
              <p className="text-sm text-gray-600 mb-2">One-time payment</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">$9.99</p>
              <div className="space-y-4">
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Full Access</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-semibold">Unlimited</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Included</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Included</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Included</span>
                </div>
                <div className="py-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Early Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {upgrading ? "Processing..." : "Upgrade to Pro - $9.99"}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Secure payment processed by Stripe • One-time payment • No recurring
            charges
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
