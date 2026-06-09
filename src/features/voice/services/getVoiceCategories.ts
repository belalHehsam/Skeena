import { customFetch } from "@/services/customFetch";
import type { VoiceCategory } from "../types/voice";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function getVoiceCategories() {
  const res = await customFetch<JSendSuccess<{ data: VoiceCategory[] }>>(
    "/api/voice-channels/categories"
  );
  return res.data.data;
}
