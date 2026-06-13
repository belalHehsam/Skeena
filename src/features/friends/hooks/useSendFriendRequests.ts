import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "../services/sendFriendRequest";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";
import { toast } from "sonner";

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sendFriendRequest(id),
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.status(variables),
      });
      // queryClient.invalidateQueries({
      //   queryKey: FRIENDS_QUERY_KEYS.suggestions,
      // });
      toast.success("Request sent successfully");
    },
    onError(error) {
      console.log(error);
      toast.error("Failed to send request");
    },
  });
};

