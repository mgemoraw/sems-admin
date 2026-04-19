// src/context/AuthContext.tsx
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import api from "../api/client";

// ===== Types =====
export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "qa" | "apo" | "dean" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (form: { username: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ===== Context =====
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
});

// ===== Provider =====
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ===== Load current user =====
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== On app start =====
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ===== Login =====
  const login = async (form: { username: string; password: string }) => {
    try {
      const data = new URLSearchParams();
      data.append("username", form.username);
      data.append("password", form.password);

      await api.post("/auth/login", form, {
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // cookie is set by backend → now fetch user
      await fetchUser();

      return true;
    } catch (error) {
      return false;
    }
  };

  // ===== Logout =====
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // optional backend endpoint
    } catch {}
    setUser(null);
  };

  // ===== Manual refresh =====
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}