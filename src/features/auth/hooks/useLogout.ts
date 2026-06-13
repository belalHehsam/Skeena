// src/features/auth/hooks/useLogout.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { logoutRequest } from "../services/logoutRequest";
import { useAuth } from "./useAuth";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";

type UseLogoutOptions = {
  onSettled?: () => void;
};

export function useLogout(options?: UseLogoutOptions) {
  const { clearAuthSession } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.logout,
    mutationFn: logoutRequest,
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Logout request failed, but your local session was cleared",
        ),
      );
    },
    onSettled: () => {
      clearAuthSession();
      queryClient.clear();
      options?.onSettled?.();
    },
  });
}
