import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "../services/api";
import { setAuthToken } from "../services/api";

const TOKEN_STORAGE_KEY = "userToken";

type AuthTokenPayload = {
  exp?: number;
  user?: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (receivedToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readValidToken(token: string) {
  const decoded = jwtDecode<AuthTokenPayload>(token);
  const currentTime = Date.now() / 1000;

  if (!decoded.exp || decoded.exp <= currentTime || !decoded.user) {
    return null;
  }

  return decoded;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (receivedToken: string) => {
    const decoded = readValidToken(receivedToken);

    if (!decoded?.user) {
      throw new Error("Invalid or expired session token");
    }

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    setAuthToken(receivedToken);
    setToken(receivedToken);
    setUser(decoded.user);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<AuthTokenPayload>(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = (decoded.exp || 0) - currentTime;

      if (timeLeft <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(() => {
        logout();
      }, timeLeft * 1000);

      return () => clearTimeout(timer);
    } catch {
      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    async function bootstrapSession() {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

        if (savedToken) {
          const decoded = readValidToken(savedToken);

          if (decoded?.user) {
            setAuthToken(savedToken);
            setToken(savedToken);
            setUser(decoded.user);
          } else {
            setAuthToken(null);
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } catch {
        setAuthToken(null);
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }

    bootstrapSession();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [loading, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
