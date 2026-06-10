import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoiceChannel } from "../services/createVoiceChannel";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";
import { toast } from "sonner";

export function useCreateVoiceChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVoiceChannel,
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.all });
      toast.success(`"${newChannel.title}" created!`);
    },
    onError: () => toast.error("Failed to create channel"),
  });
}
