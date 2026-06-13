import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { loginRequest } from "../services/loginRequest";
import type { AuthPayload, LoginRequest } from "../types/auth";
import { useAuth } from "./useAuth";

import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";
type UseLoginOptions = {
  onSuccess?: (payload: AuthPayload) => void;
};

type LoginVariables = {
  payload: LoginRequest;
  rememberMe?: boolean;
};

export function useLogin(options?: UseLoginOptions) {
  const { setAuthSession } = useAuth();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.login,
    mutationFn: ({ payload }: LoginVariables) => loginRequest(payload),
    onSuccess: (payload, variables) => {
      setAuthSession(payload, variables.rememberMe ?? true);
      toast.success("Welcome back");
      options?.onSuccess?.(payload);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Login failed"));
    },
  });
}
