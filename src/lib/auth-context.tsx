"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UserRole,
  Profile,
  StudentProfile,
  ProfessorProfile,
  AdminProfile,
} from "@/types";
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
    email: "ajay.k@uohyd.ac.in",
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
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "uohyd_attendance_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persistent user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        // Default initial session for immediate convenience
        setUser(DEMO_ACCOUNTS.professor.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ACCOUNTS.professor.user));
      }
    } catch (e) {
      setUser(DEMO_ACCOUNTS.professor.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate network latency
    await new Promise((res) => setTimeout(res, 600));

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check matching demo accounts
    let matchedRole: UserRole | null = requestedRole || null;
    let matchedUser: AuthUser | null = null;

    if (cleanEmail === DEMO_ACCOUNTS.student.email.toLowerCase()) {
      matchedRole = "student";
      matchedUser = DEMO_ACCOUNTS.student.user;
    } else if (cleanEmail === DEMO_ACCOUNTS.professor.email.toLowerCase()) {
      matchedRole = "professor";
      matchedUser = DEMO_ACCOUNTS.professor.user;
    } else if (cleanEmail === DEMO_ACCOUNTS.admin.email.toLowerCase()) {
      matchedRole = "admin";
      matchedUser = DEMO_ACCOUNTS.admin.user;
    } else {
      // Check other student roster emails
      const studentMatch = MOCK_STUDENTS.find(
        (s) => s.email.toLowerCase() === cleanEmail
      );
      if (studentMatch) {
        matchedRole = "student";
        matchedUser = { ...studentMatch };
      } else if (cleanEmail.includes("@uohyd.ac.in") || cleanEmail.includes("uohyd")) {
        // Generic fallback for any uohyd institutional address
        const fallbackRole = requestedRole || "student";
        matchedRole = fallbackRole;
        matchedUser = {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          fullName: cleanEmail.split("@")[0].replace(".", " ").toUpperCase(),
          role: fallbackRole,
          department: "Department of Systems & Computational Biology",
          rollNumber: fallbackRole === "student" ? "23MCMS99" : undefined,
        };
      }
    }

    if (!matchedUser || !matchedRole) {
      setIsLoading(false);
      return {
        success: false,
        error: "Invalid institutional credentials. Please use your @uohyd.ac.in account.",
      };
    }

    // Set and persist
    setUser(matchedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
    setIsLoading(false);

    // Route to appropriate role dashboard
    if (matchedRole === "student") {
      router.push("/student/dashboard");
    } else if (matchedRole === "professor") {
      router.push("/professor/dashboard");
    } else {
      router.push("/admin/dashboard");
    }

    return { success: true };
  };

  const quickDemoLogin = (roleToSelect: UserRole) => {
    const demo = DEMO_ACCOUNTS[roleToSelect];
    setUser(demo.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demo.user));

    if (roleToSelect === "student") {
      router.push("/student/dashboard");
    } else if (roleToSelect === "professor") {
      router.push("/professor/dashboard");
    } else {
      router.push("/admin/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  };

  const switchRole = (newRole: UserRole) => {
    const demo = DEMO_ACCOUNTS[newRole];
    setUser(demo.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demo.user));

    if (newRole === "student") {
      router.push("/student/dashboard");
    } else if (newRole === "professor") {
      router.push("/professor/dashboard");
    } else {
      router.push("/admin/dashboard");
    }
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
