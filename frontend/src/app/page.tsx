import { Item } from "@/types/item";
import axios from "axios";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value || "";

  console.log("JWT token from cookie:", token);

  try {
    const response = await axios.get("http://localhost:3000/items", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const items = response.data;

    return (
      <div className="h-screen flex flex-col items-center justify-center text-5xl font-bold">
        {items.length > 0 ? (
          items.map((item: Item, idx: number) => (
            <div key={idx} className="text-2xl my-2">
              {item.title + " -- " + item.id}
            </div>
          ))
        ) : (
          <div>No items found</div>
        )}
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
