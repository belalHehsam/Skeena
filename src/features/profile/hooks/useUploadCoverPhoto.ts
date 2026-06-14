import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMyCoverPhoto } from "@/features/profile/services/uploadMyCoverPhoto";
import {
    mergeUserIntoAuthCache,
    mergeUserIntoOwnProfileCache,
} from "@/features/profile/utils/profileCache";

export function useUploadCoverPhoto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadMyCoverPhoto,

        onSuccess: (updatedUser) => {
            mergeUserIntoAuthCache(queryClient, updatedUser);
            mergeUserIntoOwnProfileCache(queryClient, updatedUser);
        },
    });
}