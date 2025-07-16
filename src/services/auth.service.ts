import api from "./api";

// Auth service interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  roles: string[];
}

// Auth service methods
const AuthService = {
  login: async (loginRequest: LoginRequest): Promise<JwtResponse> => {
    try {
      console.log("Login request payload:", loginRequest);
      // With the baseURL already containing /api, we don't need to add it here
      console.log("Sending to URL:", "/auth/login");

      const response = await api.post("/auth/login", loginRequest);
      console.log("Login API raw response:", response);

      const data = response.data;
      console.log("Login response data:", data);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Login response missing token:", data);
        throw new Error("Invalid response format");
      }

      return data;
    } catch (error: any) {
      // Add type annotation to error
      console.error("Login API error:", error);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
      throw error;
    }
  },

  register: async (registerRequest: RegisterRequest): Promise<any> => {
    return api.post("/auth/signup", registerRequest);
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): JwtResponse | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    if (!user || !user.roles) return false;

    // Check if user has admin role
    return user.roles.some((role) => {
      if (typeof role === "string") {
        return role === "ROLE_ADMIN";
      } else if (typeof role === "object" && role !== null) {
        return (role as any).name === "ROLE_ADMIN";
      }
      return false;
    });
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    return api.get("/user/info").then((response) => response.data);
  },

  updateUserInfo: async (userInfo: Partial<UserInfoResponse>): Promise<any> => {
    return api.put("/user/update", userInfo);
  },
};

export default AuthService;
