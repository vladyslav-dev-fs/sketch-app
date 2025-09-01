export const refreshToken = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:3000/auth/refresh-tokens", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: cookieStore.get("refresh_token"),
      }),
    });

    return res.ok;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Server logout failed:", error);
  } finally {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.replace("/login");
  }
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    const refreshSucceeded = await refreshToken();

    if (refreshSucceeded) {
      response = await fetch(url, defaultOptions);
    } else {
      window.location.replace("/login");
      throw new Error("Authentication failed");
    }
  }

  return response;
};
