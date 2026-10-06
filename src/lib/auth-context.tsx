"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { MOCK_STUDENTS, MOCK_PROFESSOR, MOCK_ADMIN } from "./mock-data";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  rollNumber?: string;
  employeeCode?: string;
  department: string;
  program?: string;
  batch?: string;
  semester?: number;
  designation?: string;
  avatarUrl?: string;
  phone?: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; user: AuthUser }> = {
  student: {
    email: "25mcms01@uohyd.ac.in",
    password: "student123",
    user: {
      ...MOCK_STUDENTS[0],
    },
  },
  professor: {
    email: "dr.rao@uohyd.ac.in",
    password: "prof123",
    user: {
      ...MOCK_PROFESSOR,
    },
  },
  admin: {
    email: "academic.admin@uohyd.ac.in",
    password: "admin123",
    user: {
      ...MOCK_ADMIN,
    },
  },
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrId: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "uohyd_attendance_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load and verify backend session on mount
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user && isMounted) {
            setUser(data.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
            setIsLoading(false);
            return;
          }
        }

        // Fallback: Check local storage session cache
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        } else if (isMounted) {
          setUser(null);
        }
      } catch (e) {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        } else if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Real database-backed login
  const login = async (
    emailOrId: string,
    password: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: emailOrId.trim(),
          password: password.trim(),
          role: requestedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Authentication failed. Invalid ID or password.",
        };
      }

      const authenticatedUser: AuthUser = data.user;
      setUser(authenticatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
      setIsLoading(false);

      // Route to the appropriate dashboard
      if (authenticatedUser.role === "student") {
        router.push("/student/dashboard");
      } else if (authenticatedUser.role === "professor") {
        router.push("/professor/dashboard");
      } else {
        router.push("/admin/dashboard");
      }

      return { success: true };
    } catch (err: any) {
      console.error("Login request failed:", err);
      setIsLoading(false);
      return {
        success: false,
        error: "Network error: Unable to connect to central authentication service.",
      };
    }
  };

  const quickDemoLogin = async (roleToSelect: UserRole) => {
    const demo = DEMO_ACCOUNTS[roleToSelect];
    await login(demo.email, demo.password, roleToSelect);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}

    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  };

  const switchRole = async (newRole: UserRole) => {
    const demo = DEMO_ACCOUNTS[newRole];
    await login(demo.email, demo.password, newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickDemoLogin,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false, error: "AuthProvider not mounted" }),
      quickDemoLogin: async () => {},
      logout: async () => {},
      switchRole: async () => {},
    };
  }
  return context;
}
