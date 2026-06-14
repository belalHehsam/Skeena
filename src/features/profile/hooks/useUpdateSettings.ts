import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";
import type { MePayload } from "@/features/auth/types/auth";
import { updateMySettings } from "@/features/profile/services/updateMySettings";
import type { UpdateSettingsInput } from "@/features/profile/types/profile";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

type UpdateSettingsContext = {
    previousMe?: MePayload;
};

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    const { t } = useTranslation("settings");

    return useMutation({
        mutationFn: updateMySettings,

        onMutate: async (payload: UpdateSettingsInput) => {
            await queryClient.cancelQueries({
                queryKey: AUTH_QUERY_KEYS.me,
            });

            const previousMe = queryClient.getQueryData<MePayload>(
                AUTH_QUERY_KEYS.me,
            );

            queryClient.setQueryData<MePayload>(AUTH_QUERY_KEYS.me, (current) => {
                if (!current) {
                    return current;
                }

                return {
                    user: {
                        ...current.user,
                        settings: {
                            ...current.user.settings,
                            ...payload,
                        },
                    },
                };
            });

            return {
                previousMe,
            } satisfies UpdateSettingsContext;
        },

        onSuccess: (settings) => {
            queryClient.setQueryData<MePayload>(AUTH_QUERY_KEYS.me, (current) => {
                if (!current) {
                    return current;
                }

                return {
                    user: {
                        ...current.user,
                        settings,
                    },
                };
            });
        },

        onError: (error, _payload, context) => {
            if (context?.previousMe) {
                queryClient.setQueryData(
                    AUTH_QUERY_KEYS.me,
                    context.previousMe,
                );
            }

            toast.error(getApiErrorMessage(error, t("saveError")));
        },
    });
}