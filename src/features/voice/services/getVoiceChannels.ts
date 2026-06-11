import { customFetch } from "@/services/customFetch";
import type { VoiceChannel } from "../types/voice";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function getVoiceChannels(categoryId?: string) {
  const qs = categoryId && categoryId !== "all" ? `?categoryId=${categoryId}` : "";
  const res = await customFetch<JSendSuccess<{ data: VoiceChannel[] }>>(
    `/voice-channels${qs}`
  );
  return res.data.data;
}
