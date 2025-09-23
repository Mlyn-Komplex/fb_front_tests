import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  username: string;
}
export interface Token {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  token: Token | null;
  login: (user: User, token: Token) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from storage on startup
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(JSON.parse(savedToken));
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, token: Token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
