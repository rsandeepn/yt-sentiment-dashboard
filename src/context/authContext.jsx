import { createContext, useContext, useEffect, useState } from "react";
import api, { AUTH_TOKEN_KEY } from "../api";

const AuthContext = createContext();
const AUTH_USER_KEY = "authUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );

  const clearSession = () => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const saveSession = (data) => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
        setUser(response.data);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    const handleUnauthorized = () => clearSession();
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    restoreSession();
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const authenticate = async (path, email, password) => {
    try {
      const response = await api.post(path, { email, password });
      saveSession(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Unable to connect to the server.",
      };
    }
  };

  const login = (email, password) => authenticate("/auth/login", email, password);
  const register = (email, password) =>
    authenticate("/auth/register", email, password);
  const logout = () => clearSession();

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
