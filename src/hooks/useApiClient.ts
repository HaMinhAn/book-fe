// For direct API calls from components
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Custom hook to create an authenticated API client
export const useApiClient = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const apiClient = axios.create({
    baseURL: "/api", // Using relative URL with Vite proxy
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to requests
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle auth errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Logout and redirect to login page on auth error
        logout();
        navigate("/login", {
          state: { message: "Your session has expired. Please login again." },
        });
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default useApiClient;
