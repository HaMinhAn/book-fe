import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://book-be-p3cv.onrender.com", // Use env variable for backend
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      "/books/all",
      "/books/search",
      "/books/", // Individual book endpoint
      "/auth/signin",
      "/auth/signup",
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint =
      publicEndpoints.some((endpoint) => config.url?.includes(endpoint)) &&
      config.method?.toLowerCase() === "get";

    // Only add auth token for non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added auth token to request");
      }
    } else {
      console.log("Public endpoint - not adding auth token: " + config.url);
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log("Request payload:", config.data);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common error patterns
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);

    if (error.response) {
      console.error(
        `Error ${error.response.status} from ${error.config?.url}:`,
        error.response.data
      );

      // Handle unauthorized errors (e.g., token expired)
      if (error.response.status === 401) {
        console.log("Unauthorized access - clearing auth data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    }

    return Promise.reject(error);
  }
);

export default api;
