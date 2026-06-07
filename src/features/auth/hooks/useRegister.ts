import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { registerRequest } from "../services/registerRequest";
import type { AuthPayload, RegisterRequest } from "../types/auth";
import { useAuth } from "./useAuth";
import { AUTH_QUERY_KEYS } from "../constants/auth-query-keys";

type UseRegisterOptions = {
  onSuccess?: (payload: AuthPayload) => void;
};

type RegisterVariables = {
  payload: RegisterRequest;
  rememberMe?: boolean;
};

export function useRegister(options?: UseRegisterOptions) {
  const { setAuthSession } = useAuth();

  return useMutation({
    mutationKey: [AUTH_QUERY_KEYS.register],
    mutationFn: ({ payload }: RegisterVariables) => registerRequest(payload),
    onSuccess: (payload, variables) => {
      setAuthSession(payload, variables.rememberMe ?? true);
      toast.success("Account created successfully");
      options?.onSuccess?.(payload);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Registration failed"));
    },
  });
}
