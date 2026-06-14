import { customFetch } from "@/services/customFetch";
import type {
    JSendSuccess,
    ProfileUser,
    UpdateProfileInput,
} from "@/features/profile/types/profile";

export async function updateMyProfile(payload: UpdateProfileInput) {
    const response = await customFetch<JSendSuccess<{ user: ProfileUser }>>(
        "/users/me",
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );

    return response.data.user;
}
