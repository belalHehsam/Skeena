import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";
import type { MePayload } from "@/features/auth/types/auth";
import { updateMySettings } from "@/features/profile/services/updateMySettings";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const SETTINGS_MUTATION_KEY = ["settings", "update"] as const;

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    const { t } = useTranslation("settings");

    return useMutation({
        mutationKey: SETTINGS_MUTATION_KEY,
        scope: { id: "settings-update" },
        mutationFn: updateMySettings,

        onSuccess: (settings) => {
            queryClient.setQueryData<MePayload>(AUTH_QUERY_KEYS.me, (current) => {
                if (!current) {
                    return current;
                }

                return {
                    user: {
                        ...current.user,
                        settings: {
                            ...current.user.settings,
                            ...settings,
                        },
                    },
                };
            });
        },

        onError: (error) => {
            toast.error(getApiErrorMessage(error, t("saveError")));
        },
    });
}
