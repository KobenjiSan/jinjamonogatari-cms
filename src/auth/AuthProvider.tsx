// Main auth provider for application, if user state changes, this manages it.
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getTokens } from "./tokenStorage";
import * as authApi from "./authApi";

type AuthContextValue = {
  user: authApi.MeResult | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authApi.MeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshMe() {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens) {
      setIsLoading(false);
      return;
    }

    refreshMe().finally(() => setIsLoading(false));
  }, []);

  async function signIn(identifier: string, password: string) {
    setIsLoading(true);
    try {
      const me = await authApi.login({ identifier, password });
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
      refreshMe,
    }),
    [user, isLoading],
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
