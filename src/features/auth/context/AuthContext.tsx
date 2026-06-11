import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearStoredToken,
  getStoredToken,
  saveToken,
} from "../utils/authStorage";
import { getMeRequest } from "../services/getMeRequest";
import type { AuthPayload, AuthUser } from "../types/auth";

import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthSession: (payload: AuthPayload, rememberMe?: boolean) => void;
  clearAuthSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: getMeRequest,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const setAuthSession = useCallback(
    (payload: AuthPayload, rememberMe = true) => {
      saveToken(payload.token, rememberMe);
      setToken(payload.token);

      queryClient.setQueryData(AUTH_QUERY_KEYS.me, {
        user: payload.user,
      });
    },
    [queryClient],
  );

  const clearAuthSession = useCallback(() => {
    clearStoredToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all });
  }, [queryClient]);

  useEffect(() => {
    if (token && currentUserQuery.isError) {
      clearAuthSession();
    }
  }, [clearAuthSession, currentUserQuery.isError, token]);

  const user = token ? (currentUserQuery.data?.user ?? null) : null;

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading: Boolean(token && currentUserQuery.isPending),
    setAuthSession,
    clearAuthSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
