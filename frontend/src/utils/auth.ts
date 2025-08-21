// Utility functions for authentication

export const refreshToken = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:3000/auth/refresh-tokens", {
      method: "POST",
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to clear server-side cookies
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Server logout failed:", error);
  } finally {
    // Clear client-side cookies as fallback
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    window.location.replace("/login");
  }
};

// Interceptor for API calls to handle token refresh
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  // If we get a 401, try to refresh the token
  if (response.status === 401) {
    const refreshSucceeded = await refreshToken();

    if (refreshSucceeded) {
      // Retry the original request
      response = await fetch(url, defaultOptions);
    } else {
      // Refresh failed, redirect to login
      window.location.replace("/login");
      throw new Error("Authentication failed");
    }
  }

  return response;
};
