// src/features/auth/hooks/useLogout.ts

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants/queryKeys";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { logoutRequest } from "../services/logoutRequest";
import { useAuth } from "./useAuth";

type UseLogoutOptions = {
    onSettled?: () => void;
};

export function useLogout(options?: UseLogoutOptions) {
    const { clearAuthSession } = useAuth();

    return useMutation({
        mutationKey: queryKeys.auth.logout,
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
            options?.onSettled?.();
        },
    });
}