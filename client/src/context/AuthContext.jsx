import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (data) => {
    const normalizedUser = { ...data, role: data?.role || "guest" };
    const mockToken = "mock-jwt-token";
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setToken(mockToken);
    toast.success("Logged in successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
