import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMyAvatar } from "@/features/profile/services/uploadMyAvatar";
import {
    mergeUserIntoAuthCache,
    mergeUserIntoOwnProfileCache,
} from "@/features/profile/utils/profileCache";

export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadMyAvatar,

        onSuccess: (updatedUser) => {
            mergeUserIntoAuthCache(queryClient, updatedUser);
            mergeUserIntoOwnProfileCache(queryClient, updatedUser);
        },
    });
}