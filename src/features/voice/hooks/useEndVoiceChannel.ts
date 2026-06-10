import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endVoiceChannel } from "../services/endVoiceChannel";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";
import { toast } from "sonner";

export function useEndVoiceChannel(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => endVoiceChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.all });
      toast.success("Room ended");
    },
    onError: () => toast.error("Failed to end channel"),
  });
}
