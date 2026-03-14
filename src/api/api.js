import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}/api`;
const PUBLIC_AUTH_PATHS = new Set(["/auth/login", "/auth/signup"]);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const requestUrl = config.url || "";
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.has(requestUrl);
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (isPublicAuthRoute) {
    delete config.headers.Authorization;
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
