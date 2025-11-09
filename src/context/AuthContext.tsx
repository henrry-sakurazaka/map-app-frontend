import React, { createContext, useContext, useState,  type ReactNode, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  image_url?: string;
  provider?: string;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  // ページリロード時に localStorage から復元
  useEffect(() => {
    if (token) {
      setToken(token);
      // 必要なら API でユーザー情報を取得して user を復元
      const savedUser = localStorage.getItem("authUser");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
