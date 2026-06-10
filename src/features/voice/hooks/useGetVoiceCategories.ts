import { useQuery } from "@tanstack/react-query";
import { getVoiceCategories } from "../services/getVoiceCategories";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";

export function useGetVoiceCategories() {
  return useQuery({
    queryKey: VOICE_QUERY_KEYS.categories(),
    queryFn: getVoiceCategories,
    staleTime: 5 * 60 * 1000, // Categories don't change often
  });
}
