import { customFetch } from "@/services/customFetch";
import type {
    JSendSuccess,
    ProfileUser,
} from "@/features/profile/types/profile";

export async function uploadMyCoverPhoto(file: File) {
    const formData = new FormData();

    formData.append("coverPhoto", file);

    const response = await customFetch<JSendSuccess<{ user: ProfileUser }>>(
        "/users/me/cover-photo",
        {
            method: "PATCH",
            body: formData,
        },
    );

    return response.data.user;
}
