import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message;

      // Only handle token invalidation once
      if (errorMessage === "Invalid token") {
        console.warn("Auth Error:", errorMessage);
        Cookies.remove("auth-token");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors (e.g., insufficient permissions)
    if (error.response?.status === 403) {
      console.error("Permission denied:", error.response?.data);
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.message === "Network Error") {
      console.error("Network error - please check your connection");
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
      return Promise.reject(new Error("Request timed out - please try again"));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default api;
