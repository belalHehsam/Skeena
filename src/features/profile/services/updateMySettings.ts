import { customFetch } from "@/services/customFetch";
import type { UserSettings } from "@/features/auth/types/auth";
import type {
    JSendSuccess,
    UpdateSettingsInput,
} from "@/features/profile/types/profile";

export async function updateMySettings(payload: UpdateSettingsInput) {
    const response = await customFetch<
        JSendSuccess<{ settings: UserSettings }>
    >("/users/me/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return response.data.settings;
}
