import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { updateMyProfile } from "@/features/profile/services/updateMyProfile";
import {
    mergeUserIntoAuthCache,
    mergeUserIntoOwnProfileCache,
} from "@/features/profile/utils/profileCache";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { t } = useTranslation("profile");

    return useMutation({
        mutationFn: updateMyProfile,

        onSuccess: (updatedUser) => {
            mergeUserIntoAuthCache(queryClient, updatedUser);
            mergeUserIntoOwnProfileCache(queryClient, updatedUser);

            toast.success(t("edit.success"));
        },

        onError: (error) => {
            toast.error(getApiErrorMessage(error, t("edit.error")));
        },
    });
}