import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  username: string;
  email: string;
  specialization?: string | null;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateSpecialization: (specialization: string) => Promise<void>;
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
  specialization?: string;
  hireDate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? "http://localhost:8080/auth";
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
        const parsed = JSON.parse(savedUser);
        if (!parsed?.id) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } else {
          setUser(parsed);
        }
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
        id: data.userId,
        username: data.username,
        email: data.email,
        specialization: data.specialization ?? null,
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
        id: responseData.userId,
        username: responseData.username,
        email: responseData.email,
        specialization: responseData.specialization ?? null,
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

  const updateSpecialization = async (specialization: string) => {
    if (!token) {
      throw new Error("Пользователь не авторизован");
    }
    const response = await fetch(`${AUTH_API_URL}/me/specialization`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ specialization }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Ошибка обновления специализации");
    }
    const updated = await response.json();
    const currentUser = user;
    if (!currentUser) return;
    const nextUser: User = {
      ...currentUser,
      specialization: updated.specialization ?? specialization,
    };
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        updateSpecialization,
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
