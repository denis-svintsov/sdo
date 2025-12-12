import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface User {
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  positionId?: string;
  departmentId?: string;
  hireDate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_API_URL = "http://localhost:8080/api/auth";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Восстановление сессии из localStorage
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = "Неверный логин или пароль";
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Если не удалось распарсить JSON, используем дефолтное сообщение
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const userData: User = {
        username: data.username,
        email: data.email,
        roles: data.roles || [],
      };

      setToken(data.token);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setLocation("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Ошибка при регистрации";
        try {
          const error = await response.json();
          // Если это объект с полями валидации
          if (typeof error === 'object' && !error.message) {
            const errors = Object.values(error).join(', ');
            errorMessage = errors || errorMessage;
          } else {
            errorMessage = error.message || error.error || errorMessage;
          }
        } catch {
          // Если не удалось распарсить JSON, используем дефолтное сообщение
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const userData: User = {
        username: responseData.username,
        email: responseData.email,
        roles: responseData.roles || [],
      };

      setToken(responseData.token);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, responseData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setLocation("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // Инвалидация сессии на сервере
    if (token) {
      try {
        await fetch(`${AUTH_API_URL}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Ошибка при выходе:", error);
      }
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setLocation("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
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

