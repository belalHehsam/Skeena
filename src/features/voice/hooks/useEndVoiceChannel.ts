import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endVoiceChannel } from "../services/endVoiceChannel";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";
import { toast } from "sonner";
import i18n from "@/i18n";

export function useEndVoiceChannel(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => endVoiceChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.all });
      toast.success(i18n.t("errors:voice.roomEnded"));
    },
    onError: () => toast.error(i18n.t("errors:voice.failedToEnd")),
  });
}
