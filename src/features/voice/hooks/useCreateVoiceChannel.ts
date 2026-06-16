import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoiceChannel } from "../services/createVoiceChannel";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";
import { toast } from "sonner";
import i18n from "@/i18n";

export function useCreateVoiceChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVoiceChannel,
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.all });
      toast.success(i18n.t("errors:voice.createdSuccess", { title: newChannel.title }));
    },
    onError: () => toast.error(i18n.t("errors:voice.failedToCreate")),
  });
}
