"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
} from "@heroicons/react/24/outline";
import { logout, fetchWithAuth } from "@/utils/auth";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface ItemResult {
  id: number;
  title: string;
  item: string;
  itemDescription: string;
  aiDescription: string;
  prompt: string;
  bookmarked: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [item, setItem] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const itemTextareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [results]);

  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleGenerateDescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item.trim() || !itemDescription.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await fetchWithAuth("http://localhost:3000/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: item.trim(),
          itemDescription: itemDescription.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newResult: ItemResult = {
          id: result.id,
          title: result.title,
          item: result.item,
          itemDescription: result.itemDescription,
          aiDescription: result.aiDescription,
          prompt: result.prompt,
          bookmarked: result.bookmarked,
          timestamp: new Date(),
        };

        setResults((prev) => [...prev, newResult]);

        // Очищуємо форму після успішного створення
        setItem("");
        setItemDescription("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate description");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate description"
      );
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBookmark = async (resultId: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/items/${resultId}/bookmark`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setResults((prev) =>
          prev.map((result) =>
            result.id === resultId
              ? { ...result, bookmarked: !result.bookmarked }
              : result
          )
        );
      } else {
        throw new Error("Failed to toggle bookmark");
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to toggle bookmark"
      );
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    if (itemTextareaRef.current) {
      adjustTextareaHeight(itemTextareaRef.current);
    }
  }, [item]);

  useEffect(() => {
    if (descriptionTextareaRef.current) {
      adjustTextareaHeight(descriptionTextareaRef.current);
    }
  }, [itemDescription]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !results.length) {
    return (
      <div className="h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-2xl font-bold text-red-600 mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            AI Product Description
          </h1>
          {user?.name && (
            <p className="text-sm text-gray-600">
              Generate detailed product descriptions, {user.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </header>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto p-6">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-lg">
              <SparklesIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Generate AI Product Descriptions
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your product name and any details you know about it. Our
                AI will generate a comprehensive, professional description for
                you.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    • <strong>Item:</strong> Enter the product name (e.g.,
                    &quot;iPhone 14 Pro&quot;)
                  </li>
                  <li>
                    • <strong>Description:</strong> Add what you know about
                    features, specs, benefits
                  </li>
                  <li>
                    • <strong>AI Magic:</strong> Get a polished, detailed
                    product description
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {result.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(result.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      result.bookmarked
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    }`}
                  >
                    {result.bookmarked ? (
                      <BookmarkIcon className="w-5 h-5 fill-current" />
                    ) : (
                      <BookmarkSlashIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Original Input:
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Product:</strong> {result.item}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Your Description:</strong>{" "}
                        {result.itemDescription}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      AI-Generated Description:
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">
                        {result.aiDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={resultsEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <form
          onSubmit={handleGenerateDescription}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="item"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name *
              </label>
              <textarea
                ref={itemTextareaRef}
                id="item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g., iPhone 14 Pro, Nike Air Max, Samsung TV..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                rows={1}
                disabled={isGenerating}
                required
              />
            </div>

            <div>
              <label
                htmlFor="itemDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What you know about it *
              </label>
              <textarea
                ref={descriptionTextareaRef}
                id="itemDescription"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Features, specs, benefits, target audience, price range..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                rows={1}
                disabled={isGenerating}
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!item.trim() || !itemDescription.trim() || isGenerating}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <SparklesIcon className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Generate Description"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="mt-2 text-red-600 text-sm hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
