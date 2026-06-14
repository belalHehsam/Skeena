import { customFetch } from "@/services/customFetch";
import type {
    JSendSuccess,
    ProfileUser,
} from "@/features/profile/types/profile";

export async function uploadMyAvatar(file: File) {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await customFetch<JSendSuccess<{ user: ProfileUser }>>(
        "/users/me/avatar",
        {
            method: "PATCH",
            body: formData,
        },
    );

    return response.data.user;
}
