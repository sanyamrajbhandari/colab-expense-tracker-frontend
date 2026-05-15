import axios from "axios";

export const getStoredToken = () => {
  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt");

  if (directToken) return directToken;

  const userRaw = localStorage.getItem("user");
  if (!userRaw) return null;

  try {
    const parsedUser = JSON.parse(userRaw);
    return parsedUser?.token || parsedUser?.jwt || null;
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    const normalizedToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;
    config.headers.Authorization = `Bearer ${normalizedToken}`;
  }
  return config;
});

export default api;