import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Intercept requests
api.interceptors.request.use((config) => {
  // Only include credentials for protected endpoints
  const isProtected = !["/login", "/signup"].some((path) =>
    config.url?.includes(path)
  );

  if (isProtected) {
    config.withCredentials = true;
  }

  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Optional: redirect to login on unauthorized access
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
