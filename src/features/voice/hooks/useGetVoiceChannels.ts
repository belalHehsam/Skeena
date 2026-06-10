import { useQuery } from "@tanstack/react-query";
import { getVoiceChannels } from "../services/getVoiceChannels";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";

export function useGetVoiceChannels(categoryId?: string) {
  return useQuery({
    queryKey: VOICE_QUERY_KEYS.channels(categoryId),
    queryFn: () => getVoiceChannels(categoryId),
    staleTime: 20_000,
    refetchInterval: 30_000, // Poll every 30s as a fallback
  });
}
