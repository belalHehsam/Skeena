import { customFetch } from "@/services/customFetch";
import type { VoiceChannel, CreateVoiceChannelPayload } from "../types/voice";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function createVoiceChannel(payload: CreateVoiceChannelPayload) {
  const res = await customFetch<JSendSuccess<{ data: VoiceChannel }>>(
    "/api/voice-channels",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return res.data.data;
}
