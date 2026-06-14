import { customFetch } from "@/services/customFetch";
import type {
    JSendSuccess,
    ProfilePageData,
} from "@/features/profile/types/profile";

type GetProfilePageOptions = {
    userId?: string;
    page: number;
    limit: number;
};

export async function getProfilePage({
    userId,
    page,
    limit,
}: GetProfilePageOptions): Promise<ProfilePageData> {
    const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    const endpoint = userId
        ? `/users/${userId}?${query.toString()}`
        : `/users/me?${query.toString()}`;

    const response = await customFetch<JSendSuccess<ProfilePageData>>(endpoint);

    return response.data;
}
