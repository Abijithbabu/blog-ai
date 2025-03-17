import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    console.warn(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default api;
