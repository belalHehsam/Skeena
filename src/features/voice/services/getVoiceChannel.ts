import { customFetch } from "@/services/customFetch";
import type { VoiceChannel } from "../types/voice";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function getVoiceChannel(channelId: string) {
  const res = await customFetch<JSendSuccess<{ data: VoiceChannel }>>(
    `/api/voice-channels/${channelId}`
  );
  return res.data.data;
}
