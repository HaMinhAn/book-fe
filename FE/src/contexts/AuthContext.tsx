import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AuthService, {
  LoginRequest,
  RegisterRequest,
  JwtResponse,
  UserInfoResponse,
} from "../services/auth.service";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<UserInfoResponse>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = AuthService.getCurrentUser();
        if (storedUser) {
          setUser({
            id: storedUser.id,
            username: storedUser.username,
            email: storedUser.email,
            roles: storedUser.roles,
          });
          setIsAuthenticated(true);
          setIsAdmin(storedUser.roles.includes("ROLE_ADMIN"));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // If there's an error, clear any invalid stored data
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const loginRequest: LoginRequest = { username, password };
      console.log("Sending login request:", loginRequest);

      const response = await AuthService.login(loginRequest);
      console.log("Login response:", response);

      if (!response || !response.token) {
        console.error("Invalid login response:", response);
        return false;
      }

      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles || [],
      });
      setIsAuthenticated(true);
      setIsAdmin(response.roles?.includes("ROLE_ADMIN") || false);

      console.log("Login successful, user:", {
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
      });

      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      await AuthService.register(userData);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const updateProfile = async (
    userData: Partial<UserInfoResponse>
  ): Promise<boolean> => {
    try {
      await AuthService.updateUserInfo(userData);

      // Refresh user data after update
      const userInfo = await AuthService.getUserInfo();
      setUser({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        address: userInfo.address,
        phoneNumber: userInfo.phoneNumber,
        roles: userInfo.roles,
      });

      return true;
    } catch (error) {
      console.error("Profile update failed", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
