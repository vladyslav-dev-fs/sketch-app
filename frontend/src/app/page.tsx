import OrbApp from "@/components/orb/App";
import axios from "axios";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value || "";

  try {
    const response = await axios.get("http://localhost:3000/users", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const user = response.data;

    return (
      <div className="flex flex-col items-center justify-center text-5xl font-bold mt-24 px-[32px]">
        {user.name ? (
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
          <button className="bg-transparent text-[18px] text-black  px-4 py-2 border border-black rounded-none hover:bg-white hover:text-black transition">
            Archive
          </button>
        </div>
      </div>
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Fetch error:",
        error.response?.status,
        error.response?.data
      );
      return (
        <div className="h-screen flex items-center justify-center text-5xl font-bold">
          Error: {error.response?.status || "Unknown"} —{" "}
          {error.response?.data?.message || "Failed to fetch items"}
        </div>
      );
    } else {
      console.error("Unexpected error", error);
      return (
        <div className="h-screen flex items-center justify-center text-5xl font-bold">
          Unknown error occurred
        </div>
      );
    }
  }
}
