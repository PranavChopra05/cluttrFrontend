import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/v1/me");
        if (!cancelled) setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = (newToken: string, newUser?: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook is intentionally co-located with its provider (standard React pattern).
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
