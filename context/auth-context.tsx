"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import api from "@/axios-instance";
import Cookies from "js-cookie";
interface User {
  id: string;
  name: string;
  email: string;
  needsOnboarding?: boolean;
  apiKey?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response?.data?.user);
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error instanceof AxiosError ? error.response?.data : error
        );
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setUser(response?.data?.user);
      if (response?.data?.user?.needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Login failed"
          : "Login failed. Please check your credentials.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password });
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Signup failed"
          : "Signup failed. This email might already be in use.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      Cookies.remove("auth-token");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error instanceof AxiosError ? error.response?.data : error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
