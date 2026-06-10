import { useQuery } from "@tanstack/react-query";
import { getVoiceChannel } from "../services/getVoiceChannel";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";

export function useGetVoiceChannel(channelId: string) {
  return useQuery({
    queryKey: VOICE_QUERY_KEYS.channel(channelId),
    queryFn: () => getVoiceChannel(channelId),
    enabled: Boolean(channelId),
  });
}
